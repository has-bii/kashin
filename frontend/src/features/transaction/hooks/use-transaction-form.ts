import { Transaction } from "../types"
import { TransactionCreateDto, transactionCreateSchema } from "../validations/schema"
import { api } from "@/lib/api"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { toast } from "sonner"

type Args =
  | { mode: "create"; onSuccess?: () => void }
  | { mode: "edit"; data: Transaction; onSuccess?: () => void }

const transactionApi = async (
  mode: "create" | "edit",
  input: TransactionCreateDto,
  id?: string,
) => {
  if (mode === "create") {
    const { data } = await api.post<Transaction>("/transaction", input)
    return data
  }
  const { data } = await api.put<Transaction>(`/transaction/${id}`, input)
  return data
}

export const useTransactionForm = (args: Args) => {
  const queryClient = useQueryClient()

  const prevData = args.mode === "edit" ? args.data : null
  const today = new Date().toISOString()

  const form = useForm({
    defaultValues: {
      type: (prevData?.type ?? "expense") as "expense" | "income",
      amount: prevData?.amount ? Number(prevData.amount) : 0,
      transactionDate: prevData?.transactionDate ? prevData.transactionDate : today,
      categoryId: (prevData?.categoryId ?? null) as string | null,
      bankAccountId: (prevData?.bankAccountId ?? null) as string | null,
      description: prevData?.description ?? "",
      notes: prevData?.notes ?? "",
    },
    validators: {
      onSubmit: transactionCreateSchema,
    },
    onSubmit: async ({ value }) => {
      const id = prevData?.id
      await mutation.mutateAsync({ input: value, id }, { onSuccess: args.onSuccess })
    },
  })

  const mutation = useMutation({
    mutationFn: ({ input, id }: { input: TransactionCreateDto; id?: string }) =>
      transactionApi(args.mode, input, id),
    onSuccess: () => {
      const verb = args.mode === "create" ? "added" : "updated"
      toast.success(`Transaction has been ${verb} successfully`)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] })
    },
    onError: (error) => {
      let message = "Unexpected error has occurred"
      if (isAxiosError(error)) {
        switch (error.status) {
          case 409:
            message = "A duplicate transaction already exists"
            break
          default:
            break
        }
      } else {
        message = error.message
      }
      toast.error(message)
    },
  })

  return { form, mutation }
}
