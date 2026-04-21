import { useUpsertBudgetMutation } from "../mutations"
import { Budget, BudgetPeriod } from "../types"
import { budgetSchema } from "../validations/schema"
import { useForm } from "@tanstack/react-form"

interface UseBudgetForm {
  prevData?: Budget | null
  options?: {
    onSuccess?: () => void
    onError?: () => void
  }
}

export const useBudgetForm = ({ prevData, options }: UseBudgetForm) => {
  const mutation = useUpsertBudgetMutation(prevData?.id)

  const form = useForm({
    defaultValues: {
      categoryId: prevData?.categoryId || "",
      amount: prevData?.amount || 0,
      period: (prevData?.period || "monthly") as BudgetPeriod,
      alertThreshold: prevData ? Math.round(prevData.alertThreshold * 100) : 80,
    },
    validators: {
      onSubmit: budgetSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await mutation.mutateAsync(value, options)
      formApi.reset()
    },
  })

  return { form, mutation }
}
