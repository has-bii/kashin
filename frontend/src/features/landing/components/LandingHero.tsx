import Link from "next/link"
import { MockReceiptCard } from "./MockReceiptCard"

export function LandingHero() {
  return (
    <section
      className="bg-background relative flex min-h-dvh items-center overflow-hidden pt-[60px]"
      style={{
        backgroundImage: `
          linear-gradient(color-mix(in oklch, var(--border) 50%, transparent) 1px, transparent 1px),
          linear-gradient(90deg, color-mix(in oklch, var(--border) 50%, transparent) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
      }}
    >
      {/* Radial ambient glow */}
      <div
        className="pointer-events-none absolute w-[400px] h-[400px] lg:w-[600px] lg:h-[600px]"
        style={{
          top: "20%",
          right: "10%",
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 8%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]"
        style={{
          bottom: "10%",
          left: "-5%",
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 5%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16">
        {/* Left: Text content */}
        <div>
          {/* Eyebrow */}
          <div
            className="mb-7 inline-flex items-center gap-2"
            style={{ animation: "landing-fade-up 0.6s ease-out both", animationDelay: "0.1s" }}
          >
            <div className="bg-primary h-px w-7" />
            <span
              className="text-primary uppercase tracking-[0.12em]"
              style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11, fontWeight: 600 }}
            >
              AI-Powered Expense Tracking
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-foreground mb-7 text-[clamp(40px,6vw,80px)] leading-[1.05]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 300, animation: "landing-fade-up 0.6s ease-out both", animationDelay: "0.2s" }}
          >
            Your finances,
            <br />
            <em className="text-primary italic">finally</em> understood.
          </h1>

          {/* Subtext */}
          <p
            className="text-muted-foreground mb-10 max-w-[440px] text-base leading-[1.7] sm:text-[17px]"
            style={{
              fontFamily: "var(--font-geist-sans)",
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
            style={{ animation: "landing-fade-up 0.6s ease-out both", animationDelay: "0.5s" }}
          >
            <Link href="/auth/register">
              <button
                className="bg-primary text-primary-foreground flex cursor-pointer items-center gap-2 rounded-[10px] border-none px-7 py-3.5 text-sm font-semibold tracking-[0.01em] transition-[filter,transform] hover:brightness-110 hover:-translate-y-px sm:text-[15px] sm:px-8"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                Get started free
                <span className="text-lg leading-none">→</span>
              </button>
            </Link>

            <Link href="/auth/login">
              <button
                className="text-muted-foreground border-border cursor-pointer rounded-[10px] border bg-transparent px-7 py-3.5 text-sm font-normal transition-[border-color,color] hover:border-foreground/25 hover:text-foreground sm:text-[15px] sm:px-8"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                Sign in
              </button>
            </Link>
          </div>

          {/* Micro-stat chip */}
          <div
            className="mt-10 sm:mt-12"
            style={{ display: "flex", alignItems: "center", animation: "landing-fade-up 0.6s ease-out both", animationDelay: "0.65s" }}
          >
            <div className="border-border bg-card flex items-center gap-4 rounded-[10px] border px-[18px] py-[10px]">
              <div>
                <p
                  className="text-foreground leading-none"
                  style={{ fontFamily: "var(--font-geist-mono)", fontSize: 20, fontWeight: 600 }}
                >
                  0
                </p>
                <p
                  className="text-muted-foreground mt-0.5"
                  style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11 }}
                >
                  Manual entries
                </p>
              </div>
              <div className="bg-border h-8 w-px" />
              <div>
                <p
                  className="text-primary leading-none"
                  style={{ fontFamily: "var(--font-geist-mono)", fontSize: 20, fontWeight: 600 }}
                >
                  100%
                </p>
                <p
                  className="text-muted-foreground mt-0.5"
                  style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11 }}
                >
                  Automated
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Receipt card */}
        <div
          className="hidden lg:flex items-center justify-center"
          style={{ animation: "landing-fade-up 0.6s ease-out both", animationDelay: "0.4s" }}
        >
          <MockReceiptCard />
        </div>
      </div>
    </section>
  )
}
