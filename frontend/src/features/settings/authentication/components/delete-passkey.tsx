import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { Passkey } from "@better-auth/passkey/client"
import { PASSKEY_QUERY_KEY } from "../api/get-passkey-list.query"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

type Props = {
  data: Passkey | null
  open: boolean
  close: () => void
}

export function DeletePasskey({ open, close, data }: Props) {
  const queryClient = useQueryClient()
  const [isLoading, startTransition] = useTransition()

  const handleDelete = () => {
    if (!data) return

    startTransition(async () => {
      const { error } = await authClient.passkey.deletePasskey({ id: data.id })

      if (error) {
        toast.error(error.message || "Failed to delete passkey")
        return
      }

      await queryClient.invalidateQueries({
        queryKey: PASSKEY_QUERY_KEY,
      })

      toast.success("Passkey deleted")
      close()
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Passkey</AlertDialogTitle>
          <AlertDialogDescription>
            The passkey will be deleted, are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" disabled={isLoading} onClick={handleDelete}>
            Continue {isLoading && <Loader2 className="animate-spin" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
