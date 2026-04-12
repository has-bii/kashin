import { RecurringTransaction } from "../types"
import {
  RecurringTransactionCreateDto,
  recurringTransactionCreateSchema,
} from "../validations/schema"
import { api } from "@/lib/api"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type Args =
  | { mode: "create"; onSuccess?: () => void }
  | { mode: "edit"; data: RecurringTransaction; onSuccess?: () => void }

const recurringTransactionApi = async (
  mode: "create" | "edit",
  input: RecurringTransactionCreateDto,
  id?: string,
) => {
  if (mode === "create") {
    const { data } = await api.post<RecurringTransaction>("/recurring-transaction", input)
    return data
  }
  const { data } = await api.put<RecurringTransaction>(`/recurring-transaction/${id}`, input)
  return data
}

export const useRecurringTransactionForm = (args: Args) => {
  const queryClient = useQueryClient()
  const prevData = args.mode === "edit" ? args.data : null

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
      onSubmit: recurringTransactionCreateSchema,
    },
    onSubmit: async ({ value }) => {
      const id = prevData?.id
      await mutation.mutateAsync({ input: value, id }, { onSuccess: args.onSuccess })
    },
  })

  const mutation = useMutation({
    mutationFn: ({ input, id }: { input: RecurringTransactionCreateDto; id?: string }) =>
      recurringTransactionApi(args.mode, input, id),
    onSuccess: () => {
      const verb = args.mode === "create" ? "added" : "updated"
      toast.success(`Recurring transaction has been ${verb} successfully`)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] })
    },
    onError: () => {
      toast.error("Unexpected error has occurred")
    },
  })

  return { form, mutation }
}
