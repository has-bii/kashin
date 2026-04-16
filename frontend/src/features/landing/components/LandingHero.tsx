import Link from "next/link"
import { MockReceiptCard } from "./MockReceiptCard"

export function LandingHero() {
  return (
    <section
      className="bg-background"
      style={{
        minHeight: "100dvh",
        backgroundImage: `
          linear-gradient(color-mix(in oklch, var(--border) 50%, transparent) 1px, transparent 1px),
          linear-gradient(90deg, color-mix(in oklch, var(--border) 50%, transparent) 1px, transparent 1px)
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
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 8%, transparent) 0%, transparent 70%)",
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
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 5%, transparent) 0%, transparent 70%)",
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
              className="bg-primary"
              style={{ height: 1, width: 28 }}
            />
            <span
              className="text-primary"
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              AI-Powered Expense Tracking
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(52px, 6vw, 80px)",
              fontWeight: 300,
              lineHeight: 1.05,
              marginBottom: 28,
              animation: "landing-fade-up 0.6s ease-out both",
              animationDelay: "0.2s",
            }}
          >
            Your finances,
            <br />
            <em
              className="text-primary"
              style={{ fontStyle: "italic" }}
            >
              finally
            </em>{" "}
            understood.
          </h1>

          {/* Subtext */}
          <p
            className="text-muted-foreground"
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 17,
              lineHeight: 1.7,
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
            className="flex flex-wrap items-center gap-4"
            style={{
              animation: "landing-fade-up 0.6s ease-out both",
              animationDelay: "0.5s",
            }}
          >
            <Link href="/auth/register">
              <button
                className="bg-primary text-primary-foreground cursor-pointer transition-[filter,transform] hover:brightness-110 hover:-translate-y-px"
                style={{
                  border: "none",
                  padding: "14px 28px",
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: 10,
                  letterSpacing: "0.01em",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Get started free
                <span style={{ fontSize: 18, lineHeight: 1 }}>→</span>
              </button>
            </Link>

            <Link href="/auth/login">
              <button
                className="text-muted-foreground border-border cursor-pointer transition-[border-color,color] hover:border-foreground/25 hover:text-foreground"
                style={{
                  background: "transparent",
                  border: "1px solid var(--border)",
                  padding: "14px 28px",
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 15,
                  fontWeight: 400,
                  borderRadius: 10,
                }}
              >
                Sign in
              </button>
            </Link>
          </div>

          {/* Micro-stat chip */}
          <div
            style={{
              marginTop: 48,
              display: "flex",
              alignItems: "center",
              animation: "landing-fade-up 0.6s ease-out both",
              animationDelay: "0.65s",
            }}
          >
            <div
              className="bg-card border-border flex items-center gap-4"
              style={{
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "10px 18px",
              }}
            >
              <div>
                <p
                  className="text-foreground"
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 20,
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  0
                </p>
                <p
                  className="text-muted-foreground"
                  style={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: 11,
                    marginTop: 2,
                  }}
                >
                  Manual entries
                </p>
              </div>
              <div
                className="bg-border"
                style={{ width: 1, height: 32 }}
              />
              <div>
                <p
                  className="text-primary"
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 20,
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  100%
                </p>
                <p
                  className="text-muted-foreground"
                  style={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: 11,
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
