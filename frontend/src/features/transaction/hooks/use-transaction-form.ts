import { useUpsertTransactionMutation } from "../mutations"
import { Transaction } from "../types"
import { transactionSchema } from "../validations/schema"
import { useForm } from "@tanstack/react-form"

interface UseTransactionForm {
  prevData?: Transaction | null
  options?: {
    onSuccess?: () => void
    onError?: () => void
  }
}

export const useTransactionForm = ({ prevData, options }: UseTransactionForm) => {
  const mutation = useUpsertTransactionMutation(prevData?.id)
  const today = new Date().toISOString()

  const form = useForm({
    defaultValues: {
      type: (prevData?.type ?? "expense") as "expense" | "income",
      amount: prevData?.amount ? Number(prevData.amount) : 0,
      transactionDate: prevData?.transactionDate ?? today,
      categoryId: (prevData?.categoryId ?? null) as string | null,
      bankAccountId: (prevData?.bankAccountId ?? null) as string | null,
      description: prevData?.description ?? "",
      notes: prevData?.notes ?? "",
    },
    validators: {
      onSubmit: transactionSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await mutation.mutateAsync(value, options)
      formApi.reset()
    },
  })

  return { form, mutation }
}
