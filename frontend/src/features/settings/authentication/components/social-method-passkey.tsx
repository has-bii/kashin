import { getPasskeyListQueryOptions } from "../api/get-passkey-list.query"
import { AddPasskey } from "./add-passkey"
import { DeletePasskey } from "./delete-passkey"
import { EditPasskey } from "./edit-passkey"
import {
  SocialMethodAction,
  SocialMethodContent,
  SocialMethodIcon,
  SocialMethodItem,
} from "./social-method"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/utils/format-date"
import { Passkey } from "@better-auth/passkey/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ChevronDown, ChevronUp, FingerprintIcon, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

export function SocialMethodPasskey() {
  const [selectedPasskey, setSelectedPasskey] = useState<Passkey | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const openDialog = () => setDialogOpen(true)
  const closeDialog = () => {
    setDialogOpen(false)
    if (selectedPasskey) {
      setTimeout(() => setSelectedPasskey(null), 200)
    }
  }
  const selectPasskey = (data: Passkey) => {
    setSelectedPasskey(data)
    setDialogOpen(true)
  }
  const dialogMode = selectedPasskey ? "edit" : "create"

  const { data } = useSuspenseQuery(getPasskeyListQueryOptions())
  const isEmpty = data.length === 0

  const [isListOpen, setIsListOpen] = useState(false)
  const listOpenToggle = () => {
    if (isEmpty) return
    setIsListOpen((prev) => !prev)
  }

  const dialogTitle = dialogMode === "create" ? "Create Passkey" : "Edit Passkey"
  const dialogDescription =
    dialogMode === "create"
      ? "Passkeys are a simple and secure way to authenticate using biometrics, a hardware key, or PIN."
      : ""

  const [dialogDeleteOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDeletePasskey, setSelectedDeletePasskey] = useState<Passkey | null>(null)
  const selectDeletePasskey = (passkey: Passkey) => {
    setSelectedDeletePasskey(passkey)
    setDeleteDialogOpen(true)
  }
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setTimeout(() => setSelectedDeletePasskey(null), 200)
  }

  return (
    <SocialMethodItem className="items-start">
      <SocialMethodIcon className="mt-2">
        <FingerprintIcon />
      </SocialMethodIcon>
      <SocialMethodContent asChild>
        <h4 className="font-heading font-semibold capitalize">Passkeys</h4>
        <div
          role={!isEmpty ? "button" : undefined}
          className="text-muted-foreground inline-flex items-center gap-1 [&>svg]:size-5"
          onClick={listOpenToggle}
        >
          <p className="text-sm">
            {isEmpty ? "You have no passkey" : `${data.length} passkeys registered`}
          </p>
          {isEmpty ? null : isListOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
        {isListOpen && !isEmpty && (
          <div className="mt-4 flex flex-col gap-2">
            {data.map((passkey) => (
              <div key={passkey.id} className="flex items-center gap-4">
                <div className="text-muted-foreground space-y-0.5 text-xs">
                  <p>{passkey.name || "No name"}</p>
                  <p>Created {formatDate(passkey.createdAt, "pp aa, PP")}</p>
                </div>
                <div className="space-x-1">
                  <Button size="icon-sm" variant="outline" onClick={() => selectPasskey(passkey)}>
                    <Pencil />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="destructive"
                    onClick={() => selectDeletePasskey(passkey)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SocialMethodContent>
      <SocialMethodAction className="mt-1">
        <ResponsiveDialog
          open={dialogOpen}
          title={dialogTitle}
          description={dialogDescription}
          trigger={<Button onClick={openDialog}>Add</Button>}
        >
          {dialogMode === "create" ? (
            <AddPasskey closeDialog={closeDialog} />
          ) : (
            <EditPasskey data={selectedPasskey!} closeDialog={closeDialog} />
          )}
        </ResponsiveDialog>
      </SocialMethodAction>
      <DeletePasskey
        open={dialogDeleteOpen}
        close={closeDeleteDialog}
        data={selectedDeletePasskey}
      />
    </SocialMethodItem>
  )
}
