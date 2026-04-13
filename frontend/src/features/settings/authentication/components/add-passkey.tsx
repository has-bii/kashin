/* eslint-disable react-hooks/set-state-in-effect */
import { ResponsiveDialogFooter, useResponsiveDialog } from "@/components/responsive-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { getBrowserAndOS } from "@/utils/get-browser-and-os"
import { Passkey } from "@better-auth/passkey/client"
import { PASSKEY_QUERY_KEY } from "../api/get-passkey-list.query"
import { useQueryClient } from "@tanstack/react-query"
import { InfoIcon, Loader2Icon } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"

type AddPasskeyProps = {
  closeDialog: () => void
}

export function AddPasskey({ closeDialog }: AddPasskeyProps) {
  const queryClient = useQueryClient()
  const { open } = useResponsiveDialog()
  const [isLoading, startTransition] = useTransition()
  const [isLoadingSave, startTransitionSave] = useTransition()
  const [error, setError] = useState("")
  const [passkey, setPasskey] = useState<Passkey | null>(null)
  const [passkeyName, setPasskeyName] = useState("")

  const invalidateQuery = async () => {
    await queryClient.invalidateQueries({
      queryKey: PASSKEY_QUERY_KEY,
    })
  }

  const addPasskey = () => {
    setError("")
    const name = getBrowserAndOS()
    startTransition(async () => {
      const { error, data } = await authClient.passkey.addPasskey({
        name,
      })

      if (error) {
        setError("Passkey registration took too long or was cancelled. Please try again.")
        return
      }

      await invalidateQuery()
      setPasskeyName(name)
      setPasskey(data)
    })
  }

  const handleCloseDialog = () => {
    closeDialog()
    setTimeout(() => {
      setError("")
      setPasskey(null)
    }, 200)
  }

  const handleSavePasskeyname = () => {
    setError("")
    if (!passkey) return
    startTransitionSave(async () => {
      const { error } = await authClient.passkey.updatePasskey({
        id: passkey.id,
        name: passkeyName,
      })

      if (error) {
        setError("Failed to change passkey name")
        return
      }

      await invalidateQuery()
      toast.success("Passkey name saved")
      handleCloseDialog()
    })
  }

  const handlePasskeyAction = () => {
    if (!passkey) {
      addPasskey()
      return
    }
    handleSavePasskeyname()
  }

  useEffect(() => {
    if (!open) {
      setPasskey(null)
    }
  }, [open])

  return (
    <>
      <div className="min-72 flex flex-col items-center justify-center px-4 md:px-0">
        {error && (
          <Alert variant="destructive">
            <InfoIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {isLoading && (
          <div className="inline-flex items-center gap-2">
            <Loader2Icon className="size-4 animate-spin" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        )}
        {passkey && (
          <Field>
            <FieldLabel>Passkey Name</FieldLabel>
            <Input value={passkeyName} onChange={(e) => setPasskeyName(e.target.value)} />
          </Field>
        )}
      </div>

      <ResponsiveDialogFooter>
        <Button variant="secondary" onClick={handleCloseDialog}>
          Cancel
        </Button>
        <Button
          onClick={handlePasskeyAction}
          disabled={isLoading || isLoadingSave || (!!passkey && !passkeyName.trim())}
        >
          {error ? "Retry" : passkey ? "Save" : "Continue"}
        </Button>
      </ResponsiveDialogFooter>
    </>
  )
}
