import { bankAccountCreateSchema, bankAccountUpdateSchema } from '../validations/schema'
import type { BankAccountCreateDto, BankAccountUpdateDto } from '../validations/schema'
import { api } from '@/lib/api'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import type { BankAccount } from '../types'

type Args =
  | { mode: 'create'; onSuccess?: () => void }
  | { mode: 'update'; prevData: BankAccount | null; onSuccess?: () => void }

const bankAccountApi = async (
  mode: 'create' | 'update',
  input: BankAccountCreateDto | BankAccountUpdateDto,
  id?: string,
) => {
  if (mode === 'create') {
    const { data } = await api.post<BankAccount>('/bank-account', input)
    return data
  }
  const { data } = await api.put<BankAccount>(`/bank-account/${id}`, input)
  return data
}

export const useBankAccountForm = (args: Args) => {
  const queryClient = useQueryClient()
  const prevData = args.mode === 'update' ? args.prevData : null

  const form = useForm(
    args.mode === 'create'
      ? {
          defaultValues: { displayName: '', bankName: '', initialBalance: 0 },
          validators: { onSubmit: bankAccountCreateSchema },
          onSubmit: async ({ value }) => {
            await mutation.mutateAsync({ input: value }, { onSuccess: args.onSuccess })
          },
        }
      : {
          defaultValues: { displayName: prevData?.displayName ?? '' },
          validators: { onSubmit: bankAccountUpdateSchema },
          onSubmit: async ({ value }) => {
            if (!prevData) return
            await mutation.mutateAsync({ input: value, id: prevData.id }, { onSuccess: args.onSuccess })
          },
        },
  )

  const mutation = useMutation({
    mutationFn: ({ input, id }: { input: BankAccountCreateDto | BankAccountUpdateDto; id?: string }) =>
      bankAccountApi(args.mode, input, id),
    onSuccess: () => {
      const verb = args.mode === 'create' ? 'created' : 'updated'
      toast.success(`Bank account ${verb} successfully`)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] })
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? 'Something went wrong')
      } else {
        toast.error('Something went wrong')
      }
    },
  })

  return { form, mutation }
}
