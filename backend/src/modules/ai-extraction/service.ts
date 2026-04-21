import { Prisma } from "../../generated/prisma/client"
import { createError } from "../../global/error"
import { prisma } from "../../lib/prisma"
import { inngest } from "../inngest/client"
import { INNGEST_FUNCTION_EVENTS } from "../inngest/functions"
import { TransactionService } from "../transaction/service"
import type { ConfirmInput, GetAllQuery } from "./dto"

export abstract class AiExtractionService {
  /* ----------------------------- Public Methods ----------------------------- */

  static async getAll(userId: string, query: GetAllQuery) {
    const { status, page = 1, limit = 20 } = query
    const skip = (page - 1) * limit

    const where: Prisma.AiExtractionWhereInput = {
      userId,
      ...(status ? { status } : {}),
    }

    const [data, total] = await prisma.$transaction([
      prisma.aiExtraction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          status: true,
          emailFrom: true,
          emailSubject: true,
          emailReceivedAt: true,
          extractedType: true,
          extractedMerchant: true,
          extractedAmount: true,
          extractedCurrency: true,
          extractedDate: true,
          confidenceScore: true,
          suggestedCategory: true,
          note: true,
          createdAt: true,
          extractedCategory: { select: { id: true, name: true, icon: true, color: true } },
          extractedBankAccount: {
            select: { id: true, bank: { select: { name: true, imageUrl: true } } },
          },
        },
      }),
      prisma.aiExtraction.count({ where }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  static async getById(userId: string, id: string) {
    const record = await prisma.aiExtraction.findUnique({
      where: { id, userId },
      include: {
        extractedCategory: { select: { id: true, name: true, icon: true, color: true } },
        extractedBankAccount: {
          select: { id: true, bank: { select: { name: true, imageUrl: true } } },
        },
        transaction: { select: { id: true } },
      },
    })

    if (!record) createError("not_found", "Extraction not found")

    return record
  }

  static async confirm(userId: string, id: string, body: ConfirmInput) {
    const record = await prisma.aiExtraction.findUnique({ where: { id, userId } })
    if (!record) createError("not_found", "Extraction not found")
    if (record!.status !== "waitingApproval") {
      createError("bad_request", "Only waitingApproval extractions can be confirmed")
    }

    const type = body.type ?? record!.extractedType
    const amount = body.amount ?? (record!.extractedAmount ? Number(record!.extractedAmount) : null)
    const currency = body.currency ?? record!.extractedCurrency
    const transactionDate = body.transactionDate
      ? new Date(body.transactionDate)
      : record!.extractedDate
    const description =
      body.description !== undefined ? body.description : record!.extractedMerchant
    const categoryId = body.categoryId !== undefined ? body.categoryId : record!.extractedCategoryId
    const bankAccountId =
      body.bankAccountId !== undefined ? body.bankAccountId : record!.extractedBankAccountId
    const notes = body.notes !== undefined ? body.notes : record!.note

    if (!type || !amount || !currency || !transactionDate) {
      createError("bad_request", "type, amount, currency, and transactionDate are required")
    }

    const result = await prisma.$transaction(async (tx) => {
      const created = await TransactionService.create(
        userId,
        {
          type: type!,
          amount: amount!,
          currency: currency!,
          transactionDate: transactionDate!,
          description,
          notes,
          source: "email",
          aiExtractionId: id,
          ...(categoryId ? { categoryId } : {}),
          ...(bankAccountId ? { bankAccountId } : {}),
        },
        tx,
      )

      await tx.aiExtraction.update({
        where: { id },
        data: { status: "confirmed", confirmedAt: new Date() },
      })

      return created
    })

    return result
  }

  static async reject(userId: string, id: string) {
    const record = await prisma.aiExtraction.findUnique({ where: { id, userId } })
    if (!record) createError("not_found", "Extraction not found")
    if (record!.status !== "waitingApproval") {
      createError("bad_request", "Only waitingApproval extractions can be rejected")
    }

    return prisma.aiExtraction.update({
      where: { id },
      data: { status: "rejected", rejectedAt: new Date() },
    })
  }

  static async reanalyze(userId: string, id: string) {
    const record = await prisma.aiExtraction.findUnique({ where: { id, userId } })
    if (!record) createError("not_found", "Extraction not found")
    if (record!.status !== "failed") {
      createError("bad_request", "Only failed extractions can be reanalyzed")
    }
    await prisma.aiExtraction.update({
      where: { id },
      data: { status: "pending", errorMessage: null, processedAt: null, finishedAt: null },
    })

    await inngest.send({
      id: `process-email-${id}-reanalyze-${Date.now()}`,
      name: "email/process.email",
      data: { aiExtractionId: id, userId },
    })

    return { message: "Reanalysis queued" }
  }

  static async cancel(userId: string, id: string) {
    const record = await prisma.aiExtraction.findUnique({ where: { id, userId } })
    if (!record) createError("not_found", "Extraction not found")
    if (!["pending", "processing"].includes(record!.status)) {
      createError("bad_request", "Only pending or processing extractions can be cancelled")
    }

    await INNGEST_FUNCTION_EVENTS.cancelEmail.sendEvent({ aiExtractionId: id })
    await prisma.aiExtraction.delete({ where: { id } })
    return { message: "Extraction cancelled" }
  }

  /* --------------------------------- Internal ------------------------------- */

  static async insert(input: Prisma.AiExtractionCreateInput) {
    return prisma.aiExtraction.create({ data: input })
  }

  static async update(id: string, input: Prisma.AiExtractionUpdateInput) {
    return prisma.aiExtraction.update({ where: { id }, data: input })
  }
}
