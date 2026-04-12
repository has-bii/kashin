import type { BankAccount } from "../types"
import { bankAccountCreateSchema } from "../validations/schema"
import type { BankAccountCreateDto } from "../validations/schema"
import { api } from "@/lib/api"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { toast } from "sonner"

type Args = { mode: "create"; onSuccess?: () => void }

const bankAccountApi = async (input: BankAccountCreateDto) => {
  const { data } = await api.post<BankAccount>("/bank-account", input)
  return data
}

export const useBankAccountForm = (args: Args) => {
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: { bankId: "" as BankAccountCreateDto["bankId"], initialBalance: 0 },
    validators: { onSubmit: bankAccountCreateSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value, { onSuccess: args.onSuccess })
    },
  })

  const mutation = useMutation({
    mutationFn: (input: BankAccountCreateDto) => bankAccountApi(input),
    onSuccess: () => {
      toast.success("Bank account created successfully")
      form.reset()
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] })
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong")
      } else {
        toast.error("Something went wrong")
      }
    },
  })

  return { form, mutation }
}
