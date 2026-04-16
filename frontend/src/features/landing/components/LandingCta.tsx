import Link from "next/link"

export function LandingCta() {
  return (
    <section
      className="bg-card border-t border-border"
      style={{
        padding: "120px 24px",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 400,
          background:
            "radial-gradient(ellipse, color-mix(in oklch, var(--primary) 12%, transparent) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
        <p
          className="text-primary"
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          Start for free
        </p>

        <h2
          className="text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 5vw, 64px)",
            fontWeight: 300,
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          Start understanding
          <br />
          your money{" "}
          <em className="text-primary" style={{ fontStyle: "italic" }}>
            today.
          </em>
        </h2>

        <p
          className="text-muted-foreground"
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 16,
            lineHeight: 1.7,
            maxWidth: 460,
            margin: "0 auto 44px",
          }}
        >
          Connect your Gmail, and Kashin starts working immediately. No credit
          card required.
        </p>

        <Link href="/auth/register">
          <button
            className="bg-primary text-primary-foreground cursor-pointer transition-[filter,transform] hover:brightness-110 hover:-translate-y-0.5"
            style={{
              border: "none",
              padding: "16px 36px",
              fontFamily: "var(--font-geist-sans)",
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 12,
              letterSpacing: "0.01em",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            Create free account
            <span style={{ fontSize: 20, lineHeight: 1 }}>→</span>
          </button>
        </Link>

        {/* Footer */}
        <div
          className="border-t border-border"
          style={{
            marginTop: 80,
            paddingTop: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="bg-primary flex items-center justify-center"
              style={{ width: 20, height: 20, borderRadius: 4 }}
            >
              <span
                className="text-primary-foreground"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                K
              </span>
            </div>
            <span
              className="text-muted-foreground"
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 13,
              }}
            >
              © 2026 Kashin
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/auth/login">
              <span
                className="text-muted-foreground cursor-pointer transition-colors hover:text-foreground"
                style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13 }}
              >
                Sign in
              </span>
            </Link>
            <Link href="/auth/register">
              <span
                className="text-muted-foreground cursor-pointer transition-colors hover:text-foreground"
                style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13 }}
              >
                Register
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
