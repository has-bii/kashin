import { useBudgetContext } from "../hooks/use-budget-context"
import { BudgetDeleteDialog } from "./budget-delete-dialog"
import BudgetForm from "./budget-form"
import { ResponsiveDialog } from "@/components/responsive-dialog"

export default function BudgetDialogs() {
  const { dialogOpen, dialogMode, selectedBudget, handleDialogClose } = useBudgetContext()

  const dialogTitle = dialogMode === "create" ? "Anggaran Baru" : "Ubah Anggaran"

  return (
    <>
      <ResponsiveDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        title={dialogTitle}
        description="Tentukan batas pengeluaran untuk kategori dalam periode tertentu."
      >
        <BudgetForm mode={dialogMode} data={selectedBudget} />
      </ResponsiveDialog>

      <BudgetDeleteDialog />
    </>
  )
}
