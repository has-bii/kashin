import Link from "next/link"
import { MockReceiptCard } from "./MockReceiptCard"

export function LandingHero() {
  return (
    <section
      style={{
        minHeight: "100dvh",
        backgroundColor: "oklch(0.09 0.008 240)",
        backgroundImage: `
          linear-gradient(oklch(1 0 0 / 0.03) 1px, transparent 1px),
          linear-gradient(90deg, oklch(1 0 0 / 0.03) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: 60,
      }}
    >
      {/* Radial ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, oklch(0.527 0.154 150.069 / 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "-5%",
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, oklch(0.527 0.154 150.069 / 0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="w-full px-6"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        {/* Left: Text content */}
        <div>
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 28,
              animation: "landing-fade-up 0.6s ease-out both",
              animationDelay: "0.1s",
            }}
          >
            <div
              style={{
                height: 1,
                width: 28,
                background: "oklch(0.527 0.154 150.069)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 11,
                fontWeight: 600,
                color: "oklch(0.527 0.154 150.069)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              AI-Powered Expense Tracking
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(52px, 6vw, 80px)",
              fontWeight: 300,
              lineHeight: 1.05,
              color: "oklch(0.97 0.012 80)",
              marginBottom: 28,
              animation: "landing-fade-up 0.6s ease-out both",
              animationDelay: "0.2s",
            }}
          >
            Your finances,
            <br />
            <em
              style={{
                fontStyle: "italic",
                color: "oklch(0.85 0.06 150)",
              }}
            >
              finally
            </em>{" "}
            understood.
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 17,
              lineHeight: 1.7,
              color: "oklch(0.62 0.02 80)",
              marginBottom: 40,
              maxWidth: 440,
              animation: "landing-fade-up 0.6s ease-out both",
              animationDelay: "0.35s",
            }}
          >
            Kashin reads your Gmail receipts, extracts every transaction with AI,
            and builds your complete financial picture — hands-free.
          </p>

          {/* CTAs */}
          <div
            className="flex items-center gap-4"
            style={{
              animation: "landing-fade-up 0.6s ease-out both",
              animationDelay: "0.5s",
              flexWrap: "wrap",
            }}
          >
            <Link href="/auth/register">
              <button
                style={{
                  background: "oklch(0.527 0.154 150.069)",
                  border: "none",
                  padding: "14px 28px",
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "oklch(0.09 0.008 240)",
                  cursor: "pointer",
                  borderRadius: 10,
                  letterSpacing: "0.01em",
                  transition: "filter 0.15s, transform 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "brightness(1.1)"
                  e.currentTarget.style.transform = "translateY(-1px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "brightness(1)"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                Get started free
                <span style={{ fontSize: 18, lineHeight: 1 }}>→</span>
              </button>
            </Link>

            <Link href="/auth/login">
              <button
                style={{
                  background: "transparent",
                  border: "1px solid oklch(1 0 0 / 0.12)",
                  padding: "14px 28px",
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 15,
                  fontWeight: 400,
                  color: "oklch(0.7 0.02 80)",
                  cursor: "pointer",
                  borderRadius: 10,
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "oklch(1 0 0 / 0.25)"
                  e.currentTarget.style.color = "oklch(0.97 0.012 80)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "oklch(1 0 0 / 0.12)"
                  e.currentTarget.style.color = "oklch(0.7 0.02 80)"
                }}
              >
                Sign in
              </button>
            </Link>
          </div>

          {/* Social proof micro-stat */}
          <div
            style={{
              marginTop: 48,
              display: "flex",
              alignItems: "center",
              gap: 20,
              animation: "landing-fade-up 0.6s ease-out both",
              animationDelay: "0.65s",
            }}
          >
            <div
              style={{ height: 1, width: 1, background: "oklch(1 0 0 / 0.1)" }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "10px 18px",
                border: "1px solid oklch(1 0 0 / 0.07)",
                borderRadius: 10,
                background: "oklch(0.12 0.01 240 / 0.6)",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 20,
                    fontWeight: 600,
                    color: "oklch(0.97 0.012 80)",
                    lineHeight: 1,
                  }}
                >
                  0
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: 11,
                    color: "oklch(0.5 0.015 80)",
                    marginTop: 2,
                  }}
                >
                  Manual entries
                </p>
              </div>
              <div
                style={{ width: 1, height: 32, background: "oklch(1 0 0 / 0.08)" }}
              />
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 20,
                    fontWeight: 600,
                    color: "oklch(0.85 0.06 150)",
                    lineHeight: 1,
                  }}
                >
                  100%
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: 11,
                    color: "oklch(0.5 0.015 80)",
                    marginTop: 2,
                  }}
                >
                  Automated
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Receipt card */}
        <div
          className="hidden lg:flex"
          style={{
            justifyContent: "center",
            alignItems: "center",
            animation: "landing-fade-up 0.6s ease-out both",
            animationDelay: "0.4s",
          }}
        >
          <MockReceiptCard />
        </div>
      </div>
    </section>
  )
}
