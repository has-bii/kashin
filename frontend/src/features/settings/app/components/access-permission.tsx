import { getAccountListQueryOptions } from "../../authentication/api/get-account-list.query"
import Google from "@/components/svgs/google"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useTransition } from "react"
import { toast } from "sonner"

export default function AccessPermission() {
  const { data: accountList } = useSuspenseQuery(getAccountListQueryOptions())
  const googleAccount = accountList.find((acc) => acc.providerId === "google")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gmail Access Permission</CardTitle>
        <CardDescription>
          We need access to your Gmail inbox. To read then detect the email as a transaction.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border">
          <GoogleAccess data={googleAccount} />
        </div>
      </CardContent>
    </Card>
  )
}

type GoogleAccessProps = {
  data?: {
    scopes: string[]
    id: string
    createdAt: Date
    updatedAt: Date
    userId: string
    providerId: string
    accountId: string
  }
}

function GoogleAccess({ data }: GoogleAccessProps) {
  const queryClient = useQueryClient()
  const [isLoading, startTransition] = useTransition()

  const accessGathered =
    data?.scopes.includes("https://www.googleapis.com/auth/gmail.readonly") || false

  const getGmailAccess = () => {
    startTransition(async () => {
      if (accessGathered || isLoading) return

      try {
        const { error } = await authClient.linkSocial({
          provider: "google",
          scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
          callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/app`,
          errorCallbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/app`,
        })

        if (error) {
          toast.error("Failed to get access")
          console.error("Failed to get access: ", error)
          return
        }

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["auth"],
          }),
          queryClient.invalidateQueries({
            queryKey: ["account-list"],
          }),
        ])
      } catch (error) {
        toast.error("Unexpected error has occurred")
        console.error("Failed to get access: ", error)
      }
    })
  }

  return (
    <div className="flex items-center gap-4 px-5 py-4 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0">
      {/* Icon */}
      <div className="[&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0">
        <Google />
      </div>
      {/* Detail */}
      <div className="space-y-0">
        <h4 className="font-semibold capitalize">Google</h4>
        <p className="text-muted-foreground text-sm">Read email inbox.</p>
      </div>

      {!accessGathered && (
        <Button className="ml-auto" disabled={isLoading} onClick={getGmailAccess}>
          Give access
        </Button>
      )}
    </div>
  )
}
