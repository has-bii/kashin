import { useCategoryDelete } from "../hooks/use-delete-category"
import { Category } from "../types"
import { ResponsiveDialogFooter } from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"

type Props = {
  close: () => void
  data: Category | null
}

export default function CategoryDelete({ close, data }: Props) {
  const deleteMutation = useCategoryDelete({ onSuccess: close })

  return (
    <ResponsiveDialogFooter>
      <Button variant="secondary" size="lg" disabled={deleteMutation.isPending} onClick={close}>
        Batal
      </Button>
      <Button
        variant="destructive"
        size="lg"
        disabled={deleteMutation.isPending}
        onClick={() => data && deleteMutation.mutate(data.id)}
      >
        Hapus
      </Button>
    </ResponsiveDialogFooter>
  )
}
