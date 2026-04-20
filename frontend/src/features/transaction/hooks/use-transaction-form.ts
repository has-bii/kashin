import { useCreateTransactionMutation, useUpdateTransactionMutation } from "../mutations"
import { Transaction } from "../types"
import { TransactionCreateDto, transactionCreateSchema } from "../validations/schema"
import { useForm } from "@tanstack/react-form"

type Args =
  | { mode: "create"; onSuccess?: () => void }
  | { mode: "edit"; data: Transaction; onSuccess?: () => void }

export const useTransactionForm = (args: Args) => {
  const prevData = args.mode === "edit" ? args.data : null
  const today = new Date().toISOString()

  const createMutation = useCreateTransactionMutation()
  const updateMutation = useUpdateTransactionMutation()
  const mutation = args.mode === "create" ? createMutation : updateMutation

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
      onSubmit: transactionCreateSchema,
    },
    onSubmit: async ({ value }: { value: TransactionCreateDto }) => {
      if (args.mode === "create") {
        await createMutation.mutateAsync(value, { onSuccess: args.onSuccess })
      } else {
        await updateMutation.mutateAsync(
          { id: prevData!.id, input: value },
          { onSuccess: args.onSuccess },
        )
      }
      form.reset()
    },
  })

  return { form, mutation }
}
