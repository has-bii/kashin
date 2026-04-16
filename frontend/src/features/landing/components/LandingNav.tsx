import Link from "next/link"

export function LandingNav() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: "1px solid oklch(1 0 0 / 0.06)",
        backdropFilter: "blur(16px)",
        backgroundColor: "oklch(0.09 0.008 240 / 0.85)",
      }}
    >
      <div
        className="flex items-center justify-between px-6"
        style={{ maxWidth: 1200, margin: "0 auto", height: 60 }}
      >
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 26,
              height: 26,
              background: "oklch(0.527 0.154 150.069)",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fontWeight: 700,
                color: "oklch(0.09 0.008 240)",
                lineHeight: 1,
              }}
            >
              K
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 16,
              fontWeight: 500,
              color: "oklch(0.97 0.012 80)",
              letterSpacing: "0.01em",
            }}
          >
            Kashin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/auth/login">
            <button
              style={{
                background: "transparent",
                border: "none",
                padding: "8px 16px",
                fontFamily: "var(--font-geist-sans)",
                fontSize: 14,
                fontWeight: 400,
                color: "oklch(0.65 0.02 80)",
                cursor: "pointer",
                borderRadius: 8,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "oklch(0.97 0.012 80)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "oklch(0.65 0.02 80)")
              }
            >
              Sign in
            </button>
          </Link>
          <Link href="/auth/register">
            <button
              style={{
                background: "oklch(0.527 0.154 150.069)",
                border: "none",
                padding: "8px 18px",
                fontFamily: "var(--font-geist-sans)",
                fontSize: 14,
                fontWeight: 600,
                color: "oklch(0.09 0.008 240)",
                cursor: "pointer",
                borderRadius: 8,
                letterSpacing: "0.01em",
                transition: "filter 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.filter = "brightness(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.filter = "brightness(1)")
              }
            >
              Get started
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
