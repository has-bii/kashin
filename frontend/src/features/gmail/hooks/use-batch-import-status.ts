import { useEffect, useRef, useState } from "react"

interface BatchImportProgress {
  status: "processing" | "completed" | null
  processed: number | null
  total: number | null
  isStreaming: boolean
}

export const useBatchImportStatus = (batchId: string | null): BatchImportProgress => {
  const [progress, setProgress] = useState<BatchImportProgress>({
    status: null,
    processed: null,
    total: null,
    isStreaming: false,
  })

  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!batchId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProgress({ status: null, processed: null, total: null, isStreaming: false })
      return
    }

    const es = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/gmail/import/${batchId}/stream`,
      {
        withCredentials: true,
      },
    )
    esRef.current = es

    setProgress((prev) => ({ ...prev, isStreaming: true }))

    es.onmessage = (e) => {
      const data = JSON.parse(e.data) as {
        status: "processing" | "completed"
        processed: number
        total: number
      }

      setProgress({ ...data, isStreaming: data.status !== "completed" })

      if (data.status === "completed") {
        es.close()
        esRef.current = null
      }
    }

    es.onerror = () => {
      es.close()
      esRef.current = null
      setProgress((prev) => ({ ...prev, isStreaming: false }))
    }

    return () => {
      es.close()
      esRef.current = null
    }
  }, [batchId])

  return progress
}
