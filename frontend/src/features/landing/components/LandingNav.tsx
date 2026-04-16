import Link from "next/link"

export function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div
        className="flex items-center justify-between px-6"
        style={{ maxWidth: 1200, margin: "0 auto", height: 60 }}
      >
        <div className="flex items-center gap-2">
          <div
            className="bg-primary flex shrink-0 items-center justify-center rounded-md"
            style={{ width: 26, height: 26 }}
          >
            <span
              className="text-primary-foreground"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              K
            </span>
          </div>
          <span
            className="text-foreground"
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            Kashin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/auth/login">
            <button
              className="text-muted-foreground cursor-pointer rounded-lg transition-colors hover:text-foreground"
              style={{
                background: "transparent",
                border: "none",
                padding: "8px 16px",
                fontFamily: "var(--font-geist-sans)",
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              Sign in
            </button>
          </Link>
          <Link href="/auth/register">
            <button
              className="bg-primary text-primary-foreground cursor-pointer rounded-lg transition-[filter,transform] hover:brightness-110"
              style={{
                border: "none",
                padding: "8px 18px",
                fontFamily: "var(--font-geist-sans)",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.01em",
              }}
            >
              Get started
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
