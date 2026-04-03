"use client"

import { getAccountInfoQueryOptions } from "../api/get-account-info.query"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ReactNode } from "react"
import { toast } from "sonner"

type SocialMethodProps = {
  provider: string
  icon: ReactNode
  accountId?: string
}

export default function SocialMethod({ provider, icon, accountId }: SocialMethodProps) {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    ...getAccountInfoQueryOptions(accountId!),
    enabled: !!accountId,
  })

  const label = provider.charAt(0).toUpperCase() + provider.slice(1)

  const linkAction = async () => {
    try {
      const { error } = await authClient.linkSocial({
        provider: provider as Parameters<typeof authClient.linkSocial>[0]["provider"],
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/authentication`,
        errorCallbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/authentication`,
      })

      if (error) {
        toast.error(error.message ?? `Failed to link your ${label} account`)
        return
      }

      await queryClient.invalidateQueries({ queryKey: ["account-list"] })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to link your ${label} account`)
    }
  }

  const unlinkAction = async () => {
    if (!accountId) return
    try {
      const { error } = await authClient.unlinkAccount({
        providerId: provider,
        accountId,
      })

      if (error) {
        toast.error(error.message ?? `Failed to unlink your ${label} account`)
        return
      }

      toast.success(`Unlinked ${label} successfully`)
      await queryClient.invalidateQueries({ queryKey: ["account-list"] })
      await queryClient.invalidateQueries({ queryKey: ["account-info", accountId] })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to unlink your ${label} account`)
    }
  }

  return (
    <div className="flex items-center gap-4 px-5 py-4 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0">
      {icon}
      <div className="space-y-0">
        <h4 className="font-semibold capitalize">{provider}</h4>
        <p className="text-muted-foreground text-sm">
          {isLoading
            ? "Loading..."
            : data?.user.email
              ? data.user.email
              : `Connect to your ${label} account`}
        </p>
      </div>
      <Button
        variant={accountId ? "secondary" : "default"}
        className="ml-auto"
        disabled={isLoading}
        onClick={accountId ? unlinkAction : linkAction}
      >
        {accountId ? "Disconnect" : "Connect"}
      </Button>
    </div>
  )
}
