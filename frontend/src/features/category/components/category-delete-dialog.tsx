import { useCategoryContext } from "../hooks/use-category-context"
import { useDeleteCategoryMutation } from "../mutations"
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

export function CategoryDeleteDialog() {
  const {
    selectedDeleteCategory: data,
    handleDeleteDialogClose: close,
    dialogDeleteOpen,
  } = useCategoryContext()
  const deleteMutation = useDeleteCategoryMutation()

  const handleDelete = () => {
    if (!data) return
    deleteMutation.mutate(data.id, {
      onSuccess: close,
    })
  }

  return (
    <AlertDialog open={dialogDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the &ldquo;{data?.name}&rdquo; category. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" size="lg" disabled={deleteMutation.isPending} onClick={close}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="lg"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            Delete {deleteMutation.isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
