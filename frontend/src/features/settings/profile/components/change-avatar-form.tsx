"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { useMemo } from "react"

export default function ChangeAvatarForm() {
  const { data } = authClient.useSession()

  const user = useMemo(() => {
    if (!data)
      return {
        image: undefined,
        fallback: "U",
      }

    return {
      image: data.user.image ?? undefined,
      fallback: data.user.name
        .split(" ")
        .map((c) => c[0])
        .join("")
        .toUpperCase(),
    }
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avatar</CardTitle>
        <CardDescription>
          Click on the avatar to uplaod a custom one from your files.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <button>
          <Avatar className="size-28">
            <AvatarImage src={user.image} />
            <AvatarFallback>{user.fallback}</AvatarFallback>
          </Avatar>
        </button>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground">An avatar is optional but strongly recommended.</p>
      </CardFooter>
    </Card>
  )
}
