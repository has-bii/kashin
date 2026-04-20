import { useUpsertBudgetMutation } from "../mutations"
import { Budget } from "../types"
import { budgetSchema } from "../validations/schema"
import { useForm } from "@tanstack/react-form"

type Args =
  | { mode: "create"; onSuccess?: () => void }
  | { mode: "update"; prevData: Budget | null; onSuccess?: () => void }

export const useBudgetForm = (args: Args) => {
  const prevData = args.mode === "update" ? args.prevData : null
  const mutation = useUpsertBudgetMutation(prevData?.id)

  const form = useForm({
    defaultValues: {
      categoryId: prevData?.categoryId ?? "",
      amount: prevData?.amount ?? 0,
      period: prevData?.period ?? ("monthly" as const),
      alertThreshold: prevData ? Math.round(prevData.alertThreshold * 100) : 80,
    },
    validators: {
      onSubmit: budgetSchema,
    },
    onSubmit: async ({ value }) => {
      if (args.mode === "update" && !prevData) return
      await mutation.mutateAsync(value, { onSuccess: args.onSuccess })
    },
  })

  return { form, mutation }
}
