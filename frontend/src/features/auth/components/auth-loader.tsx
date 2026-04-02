import { Loader2 } from "lucide-react"

export default function AuthLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className="size-12 animate-spin" />
      <span className="text-muted-foreground">Loading...</span>
    </div>
  )
}
