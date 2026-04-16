import Link from "next/link"

export function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary flex size-[26px] shrink-0 items-center justify-center rounded-md">
            <span
              className="text-primary-foreground leading-none"
              style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}
            >
              K
            </span>
          </div>
          <span
            className="text-foreground text-base font-medium tracking-[0.01em]"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Kashin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/auth/login">
            <button
              className="text-muted-foreground cursor-pointer rounded-lg border-none bg-transparent px-4 py-2 text-sm font-normal transition-colors hover:text-foreground"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Sign in
            </button>
          </Link>
          <Link href="/auth/register">
            <button
              className="bg-primary text-primary-foreground cursor-pointer rounded-lg border-none px-[18px] py-2 text-sm font-semibold tracking-[0.01em] transition-[filter,transform] hover:brightness-110"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Get started
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
