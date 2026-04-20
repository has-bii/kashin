import { useCategoryContext } from "../hooks/use-category-context"
import { CategoryDeleteDialog } from "./category-delete-dialog"
import { CategoryForm } from "./category-form"
import { ResponsiveDialog } from "@/components/responsive-dialog"

export default function CategoryDialogs() {
  const { dialogOpen, dialogMode, selectedCategory, handleDialogClose } = useCategoryContext()

  const dialogTitle = dialogMode === "create" ? "Create Category" : "Update Category"

  return (
    <>
      {/* Create and Update */}
      <ResponsiveDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        title={dialogTitle}
        description="Fill in the details for your category."
      >
        <CategoryForm mode={dialogMode} prevData={selectedCategory} />
      </ResponsiveDialog>

      {/* Delete Dialog */}
      <CategoryDeleteDialog />
    </>
  )
}
