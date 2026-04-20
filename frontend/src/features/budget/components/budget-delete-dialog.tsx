import { useBudgetContext } from "../hooks/use-budget-context"
import { useDeleteBudgetMutation } from "../mutations"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"

export function BudgetDeleteDialog() {
  const {
    selectedDeleteBudget: data,
    handleDeleteDialogClose: close,
    dialogDeleteOpen,
  } = useBudgetContext()
  const deleteMutation = useDeleteBudgetMutation()

  const handleDelete = () => {
    if (!data) return
    deleteMutation.mutate(data.id, { onSuccess: close })
  }

  return (
    <AlertDialog open={dialogDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus anggaran ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Anggaran untuk kategori &ldquo;{data?.category?.name}&rdquo; akan dihapus secara
            permanen. Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" size="lg" disabled={deleteMutation.isPending} onClick={close}>
            Batal
          </Button>
          <Button
            variant="destructive"
            size="lg"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            Hapus {deleteMutation.isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
