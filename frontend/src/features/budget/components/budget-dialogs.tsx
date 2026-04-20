import { useBudgetContext } from "../hooks/use-budget-context"
import { BudgetDeleteDialog } from "./budget-delete-dialog"
import BudgetForm from "./budget-form"
import { ResponsiveDialog } from "@/components/responsive-dialog"

export default function BudgetDialogs() {
  const { dialogOpen, dialogMode, selectedBudget, handleDialogClose } = useBudgetContext()

  const dialogTitle = dialogMode === "create" ? "Set a new limit" : "Edit your budget"
  const dialogDescription =
    dialogMode === "create"
      ? "Choose a spending category and the maximum amount you want to spend."
      : "Need to change your numbers? Update your limit or category name here."

  return (
    <>
      <ResponsiveDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        title={dialogTitle}
        description={dialogDescription}
      >
        <BudgetForm mode={dialogMode} prevData={selectedBudget} />
      </ResponsiveDialog>

      <BudgetDeleteDialog />
    </>
  )
}
