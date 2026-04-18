import { authMacro } from "../../macros/auth.macro"
import { NotFoundError } from "../../global/error"
import { prisma } from "../../lib/prisma"
import { progressBus } from "../../lib/progress-bus"
import type { ProgressPayload } from "../../lib/pg-listener"
import { GmailService } from "./service"
import { getMessagesQuery, importMessagesBody } from "./dto"
import Elysia, { t } from "elysia"

type Counts = {
  pending: number
  processing: number
  waitingApproval: number
  confirmed: number
  rejected: number
  failed: number
}

async function getBatchCounts(batchId: string): Promise<Counts> {
  const rows = await prisma.aiExtraction.groupBy({
    by: ["status"],
    where: { emailImportBatchId: batchId },
    _count: true,
  })
  const counts: Counts = {
    pending: 0,
    processing: 0,
    waitingApproval: 0,
    confirmed: 0,
    rejected: 0,
    failed: 0,
  }
  for (const row of rows) {
    counts[row.status as keyof Counts] = row._count
  }
  return counts
}

export const gmailController = new Elysia({ prefix: "/gmail" })
  .use(authMacro)
  .get("/", async ({ user, query }) => GmailService.getMessages(user.id, query), {
    auth: true,
    query: getMessagesQuery,
  })
  .post("/import", async ({ user, body }) => GmailService.importMessages(user.id, body), {
    auth: true,
    body: importMessagesBody,
  })
  .get(
    "/import/:batchId/stream",
    async ({ params, user, request }) => {
      const { batchId } = params

      const batch = await prisma.emailImportBatch.findUnique({
        where: { id: batchId },
        select: { id: true, userId: true, total: true, status: true },
      })

      if (!batch || batch.userId !== user.id) {
        throw new NotFoundError("Import batch not found")
      }

      const encoder = new TextEncoder()

      const sendFrame = (data: object) =>
        encoder.encode(`data: ${JSON.stringify(data)}\n\n`)

      const sendComment = () => encoder.encode(": ping\n\n")

      const stream = new ReadableStream({
        async start(controller) {
          const counts = await getBatchCounts(batchId)
          controller.enqueue(
            sendFrame({ type: "snapshot", batchId, total: batch.total, counts, status: batch.status }),
          )

          if (batch.status === "completed") {
            controller.enqueue(sendFrame({ type: "done", counts }))
            controller.close()
            return
          }

          const queue: Array<{ type: "progress"; payload: ProgressPayload } | { type: "ping" } | { type: "abort" }> = []
          let wake: (() => void) | null = null
          const notify = () => { if (wake) { wake(); wake = null } }

          const unsubscribe = progressBus.subscribe(batchId, (payload) => {
            queue.push({ type: "progress", payload })
            notify()
          })

          const heartbeat = setInterval(() => {
            queue.push({ type: "ping" })
            notify()
          }, 25000)

          request.signal.addEventListener("abort", () => {
            queue.push({ type: "abort" })
            notify()
          })

          try {
            while (true) {
              if (queue.length === 0) {
                await new Promise<void>((resolve) => { wake = resolve })
              }

              while (queue.length > 0) {
                const item = queue.shift()!

                if (item.type === "abort") {
                  controller.close()
                  return
                }

                if (item.type === "ping") {
                  controller.enqueue(sendComment())
                  continue
                }

                const { payload } = item
                const updatedCounts = await getBatchCounts(batchId)
                controller.enqueue(
                  sendFrame({
                    type: "progress",
                    aiExtractionId: payload.aiExtractionId,
                    status: payload.status,
                    seq: payload.seq,
                    counts: updatedCounts,
                  }),
                )

                const updatedBatch = await prisma.emailImportBatch.findUnique({
                  where: { id: batchId },
                  select: { status: true },
                })
                if (updatedBatch?.status === "completed") {
                  controller.enqueue(sendFrame({ type: "done", counts: updatedCounts }))
                  controller.close()
                  return
                }
              }
            }
          } finally {
            unsubscribe()
            clearInterval(heartbeat)
          }
        },
      })

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no",
        },
      })
    },
    {
      auth: true,
      params: t.Object({ batchId: t.String({ format: "uuid" }) }),
    },
  )
