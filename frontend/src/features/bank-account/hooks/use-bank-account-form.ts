import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import { createBankAccountApi, updateBankAccountApi } from "../api/bank-account.api"
import type { BankAccount } from "../types"
import {
  bankAccountCreateSchema,
  bankAccountUpdateSchema,
} from "../validations"

type Args =
  | { mode: "create"; onSuccess?: () => void }
  | { mode: "edit"; data: BankAccount; onSuccess?: () => void }

export const useBankAccountForm = (args: Args) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (
      values: { displayName: string; bankName: string; initialBalance: number } | { displayName: string },
    ) => {
      if (args.mode === "create") {
        return createBankAccountApi(
          values as { displayName: string; bankName: string; initialBalance: number },
        )
      } else {
        return updateBankAccountApi(args.data.id, { displayName: values.displayName })
      }
    },
    onSuccess: () => {
      toast.success(
        args.mode === "create"
          ? "Bank account created successfully"
          : "Bank account updated successfully",
      )
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] })
      args.onSuccess?.()
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong")
      } else {
        toast.error("Something went wrong")
      }
    },
  })

  const form = useForm(
    args.mode === "create"
      ? {
          defaultValues: {
            displayName: "",
            bankName: "",
            initialBalance: 0,
          },
          validators: { onSubmit: bankAccountCreateSchema },
          onSubmit: async ({ value }) => {
            await mutation.mutateAsync(value)
          },
        }
      : {
          defaultValues: {
            displayName: args.data.displayName,
          },
          validators: { onSubmit: bankAccountUpdateSchema },
          onSubmit: async ({ value }) => {
            await mutation.mutateAsync(value)
          },
        },
  )

  return { form, mutation }
}
