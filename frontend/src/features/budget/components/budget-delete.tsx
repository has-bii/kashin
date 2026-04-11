import { useDeleteBudget } from '../hooks/use-delete-budget'
import { Budget } from '../types'
import { ResponsiveDialogFooter } from '@/components/responsive-dialog'
import { Button } from '@/components/ui/button'

type Props = {
  close: () => void
  data: Budget | null
}

export default function BudgetDelete({ close, data }: Props) {
  const deleteMutation = useDeleteBudget({ onSuccess: close })

  return (
    <ResponsiveDialogFooter>
      <Button variant="secondary" size="lg" disabled={deleteMutation.isPending} onClick={close}>
        Cancel
      </Button>
      <Button
        variant="destructive"
        size="lg"
        disabled={deleteMutation.isPending}
        onClick={() => data && deleteMutation.mutate(data.id)}
      >
        Delete
      </Button>
    </ResponsiveDialogFooter>
  )
}
