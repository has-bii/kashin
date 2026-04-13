import { ResponsiveDialogFooter } from "@/components/responsive-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { Passkey } from "@better-auth/passkey/client"
import { PASSKEY_QUERY_KEY } from "../api/get-passkey-list.query"
import { useQueryClient } from "@tanstack/react-query"
import { InfoIcon, Loader2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

type EditPasskeyProps = {
  closeDialog: () => void
  data: Passkey
}

export function EditPasskey({ closeDialog, data }: EditPasskeyProps) {
  const queryClient = useQueryClient()
  const [isLoading, startTransition] = useTransition()
  const [error, setError] = useState("")

  const [passkeyName, setPasskeyName] = useState(data.name || "")

  const handleSavePasskeyname = () => {
    setError("")
    startTransition(async () => {
      const { error } = await authClient.passkey.updatePasskey({
        id: data.id,
        name: passkeyName,
      })

      if (error) {
        setError("Failed to change passkey name")
        return
      }

      await queryClient.invalidateQueries({
        queryKey: PASSKEY_QUERY_KEY,
      })

      toast.success("Passkey name updated")
      closeDialog()
    })
  }

  return (
    <>
      <FieldGroup className="flex w-full flex-col items-center justify-center gap-2 px-4 md:px-0">
        {error && (
          <Field>
            <Alert variant="destructive">
              <InfoIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </Field>
        )}
        <Field>
          <FieldLabel>Passkey Name</FieldLabel>
          <Input value={passkeyName} onChange={(e) => setPasskeyName(e.target.value)} />
        </Field>
      </FieldGroup>
      <ResponsiveDialogFooter>
        <Button variant="secondary" onClick={closeDialog}>
          Cancel
        </Button>
        <Button onClick={handleSavePasskeyname} disabled={isLoading || !passkeyName.trim()}>
          Save {isLoading && <Loader2 className="animate-spin" />}
        </Button>
      </ResponsiveDialogFooter>
    </>
  )
}
