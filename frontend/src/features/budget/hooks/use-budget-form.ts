import { Budget } from "../types"
import { BudgetDto, budgetSchema } from "../validations/schema"
import { api } from "@/lib/api"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type Args =
  | { mode: "create"; onSuccess?: () => void }
  | { mode: "update"; prevData: Budget | null; onSuccess?: () => void }

const budgetApi = async (mode: "create" | "update", input: BudgetDto, id?: string) => {
  // alertThreshold is stored as percentage in the form (1-100), send as decimal (0.01-1)
  const payload = { ...input, alertThreshold: input.alertThreshold / 100 }
  if (mode === "create") {
    const { data } = await api.post<Budget>("/budget", payload)
    return data
  }
  const { data } = await api.put<Budget>(`/budget/${id}`, payload)
  return data
}

export const useBudgetForm = (args: Args) => {
  const queryClient = useQueryClient()
  const prevData = args.mode === "update" ? args.prevData : null

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
      await mutation.mutateAsync({ input: value, id: prevData?.id }, { onSuccess: args.onSuccess })
    },
  })

  const mutation = useMutation({
    mutationFn: ({ input, id }: { input: BudgetDto; id?: string }) =>
      budgetApi(args.mode, input, id),
    onSuccess: () => {
      const verb = args.mode === "create" ? "created" : "updated"
      toast.success(`Budget has been ${verb}`)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ["budgets"] })
    },
    onError: (error) => {
      toast.error(error.message ?? "Unexpected error has occurred")
    },
  })

  return { form, mutation }
}
