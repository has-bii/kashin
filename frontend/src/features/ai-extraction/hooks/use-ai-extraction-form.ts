import { useConfirmAiExtractionMutation } from "../mutations"
import type { AiExtraction } from "../types"
import { confirmAiExtractionSchema } from "../validations/schema"
import { useForm } from "@tanstack/react-form"

interface UseAiExtractionForm {
  extraction: AiExtraction
  options?: {
    onSuccess?: () => void
    onError?: () => void
  }
}

export const useAiExtractionForm = ({ extraction, options }: UseAiExtractionForm) => {
  const mutation = useConfirmAiExtractionMutation()

  const form = useForm({
    defaultValues: {
      type: extraction.extractedType ?? undefined,
      amount: extraction.extractedAmount ? Number(extraction.extractedAmount) : undefined,
      currency: extraction.extractedCurrency ?? undefined,
      categoryId: extraction.extractedCategory?.id ?? null,
      bankAccountId: extraction.extractedBankAccount?.id ?? null,
      description: extraction.extractedMerchant ?? null,
      transactionDate: extraction.extractedDate ?? undefined,
      notes: extraction.note ?? null,
    },
    validators: {
      onSubmit: confirmAiExtractionSchema as never,
    },
    onSubmit: async ({ value, formApi }) => {
      await mutation.mutateAsync(
        { id: extraction.id, body: value },
        {
          onSuccess: () => {
            formApi.reset()
            options?.onSuccess?.()
          },
          onError: () => {
            options?.onError?.()
          },
        },
      )
    },
  })

  return { form, mutation }
}
