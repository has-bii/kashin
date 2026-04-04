import { CategoryCreateForm } from "./category-create-form"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function CategoryAddCard() {
  return (
    <ResponsiveDialog
      title="New Category"
      description="Define your expense/income category"
      trigger={
        <div
          role="button"
          className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-4xl border-4 border-dashed"
        >
          <Button size="icon-xl">
            <Plus />
          </Button>
          <p className="text-primary text-lg font-medium">Create new</p>
        </div>
      }
    >
      <CategoryCreateForm />
    </ResponsiveDialog>
  )
}
