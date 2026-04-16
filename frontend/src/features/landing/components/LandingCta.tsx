import Link from "next/link"

export function LandingCta() {
  return (
    <section
      style={{
        backgroundColor: "oklch(0.115 0.012 240)",
        borderTop: "1px solid oklch(1 0 0 / 0.06)",
        padding: "120px 24px",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Ambient teal glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 400,
          background:
            "radial-gradient(ellipse, oklch(0.527 0.154 150.069 / 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
        <p
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 11,
            fontWeight: 600,
            color: "oklch(0.527 0.154 150.069)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          Start for free
        </p>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 5vw, 64px)",
            fontWeight: 300,
            color: "oklch(0.97 0.012 80)",
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          Start understanding
          <br />
          your money{" "}
          <em style={{ fontStyle: "italic", color: "oklch(0.85 0.06 150)" }}>
            today.
          </em>
        </h2>

        <p
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 16,
            lineHeight: 1.7,
            color: "oklch(0.58 0.02 80)",
            marginBottom: 44,
            maxWidth: 460,
            margin: "0 auto 44px",
          }}
        >
          Connect your Gmail, and Kashin starts working immediately. No credit
          card required.
        </p>

        <Link href="/auth/register">
          <button
            style={{
              background: "oklch(0.527 0.154 150.069)",
              border: "none",
              padding: "16px 36px",
              fontFamily: "var(--font-geist-sans)",
              fontSize: 16,
              fontWeight: 600,
              color: "oklch(0.09 0.008 240)",
              cursor: "pointer",
              borderRadius: 12,
              letterSpacing: "0.01em",
              transition: "filter 0.15s, transform 0.15s",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(1.12)"
              e.currentTarget.style.transform = "translateY(-2px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            Create free account
            <span style={{ fontSize: 20, lineHeight: 1 }}>→</span>
          </button>
        </Link>

        {/* Footer line */}
        <div
          style={{
            marginTop: 80,
            paddingTop: 32,
            borderTop: "1px solid oklch(1 0 0 / 0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 20,
                height: 20,
                background: "oklch(0.527 0.154 150.069)",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "oklch(0.09 0.008 240)",
                }}
              >
                K
              </span>
            </div>
            <span
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 13,
                color: "oklch(0.45 0.015 80)",
              }}
            >
              © 2026 Kashin
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/auth/login">
              <span
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 13,
                  color: "oklch(0.45 0.015 80)",
                  cursor: "pointer",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "oklch(0.7 0.02 80)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "oklch(0.45 0.015 80)")
                }
              >
                Sign in
              </span>
            </Link>
            <Link href="/auth/register">
              <span
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 13,
                  color: "oklch(0.45 0.015 80)",
                  cursor: "pointer",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "oklch(0.7 0.02 80)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "oklch(0.45 0.015 80)")
                }
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
