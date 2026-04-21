import { useCreateBankAccountMutation } from "../mutations"
import type { BankAccount } from "../types"
import { bankAccountSchema } from "../validations/schema"
import type { BankAccountDto } from "../validations/schema"
import { useForm } from "@tanstack/react-form"

interface UseBankAccountForm {
  prevData?: BankAccount | null
  options?: {
    onSuccess?: () => void
    onError?: () => void
  }
}

export const useBankAccountForm = ({ prevData, options }: UseBankAccountForm = {}) => {
  const mutation = useCreateBankAccountMutation()

  const form = useForm({
    defaultValues: {
      bankId: prevData?.bank.id ?? ("" as BankAccountDto["bankId"]),
      initialBalance: 0,
    },
    validators: { onSubmit: bankAccountSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value, {
        onSuccess: () => {
          options?.onSuccess?.()
          form.reset()
        },
        onError: options?.onError,
      })
    },
  })

  return { form, mutation }
}
