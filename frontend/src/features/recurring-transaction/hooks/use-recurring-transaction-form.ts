import { useUpsertRecurringTransactionMutation } from "../mutations"
import { RecurringTransaction } from "../types"
import { recurringTransactionSchema } from "../validations/schema"
import { useForm } from "@tanstack/react-form"

interface UseRecurringTransactionForm {
  prevData?: RecurringTransaction | null
  options?: {
    onSuccess?: () => void
    onError?: () => void
  }
}

export const useRecurringTransactionForm = ({ prevData, options }: UseRecurringTransactionForm) => {
  const mutation = useUpsertRecurringTransactionMutation(prevData?.id)

  const form = useForm({
    defaultValues: {
      type: (prevData?.type ?? "expense") as "expense" | "income",
      amount: prevData?.amount ? Number(prevData.amount) : 0,
      description: prevData?.description ?? "",
      categoryId: (prevData?.categoryId ?? null) as string | null,
      frequency: (prevData?.frequency ?? "monthly") as "weekly" | "biweekly" | "monthly" | "yearly",
      nextDueDate: prevData?.nextDueDate ?? new Date().toISOString(),
    },
    validators: {
      onSubmit: recurringTransactionSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await mutation.mutateAsync(value, options)
      formApi.reset()
    },
  })

  return { form, mutation }
}
