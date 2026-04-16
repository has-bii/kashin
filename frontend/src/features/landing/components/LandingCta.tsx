import Link from "next/link"

export function LandingCta() {
  return (
    <section className="bg-card relative overflow-hidden border-t border-border px-4 py-20 sm:px-6 md:py-[120px]">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 sm:h-[400px] sm:w-[700px]"
        style={{
          background:
            "radial-gradient(ellipse, color-mix(in oklch, var(--primary) 12%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[680px] text-center">
        <p
          className="text-primary mb-5 uppercase tracking-[0.12em]"
          style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11, fontWeight: 600 }}
        >
          Start for free
        </p>

        <h2
          className="text-foreground mb-6 text-[clamp(36px,5vw,64px)] leading-[1.1]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
        >
          Start understanding
          <br />
          your money{" "}
          <em className="text-primary italic">today.</em>
        </h2>

        <p
          className="text-muted-foreground mx-auto mb-10 max-w-[460px] text-base leading-[1.7] sm:mb-11"
          style={{ fontFamily: "var(--font-geist-sans)", fontSize: 16 }}
        >
          Connect your Gmail, and Kashin starts working immediately. No credit
          card required.
        </p>

        <Link href="/auth/register">
          <button
            className="bg-primary text-primary-foreground inline-flex cursor-pointer items-center gap-2.5 rounded-xl border-none px-9 py-4 text-base font-semibold tracking-[0.01em] transition-[filter,transform] hover:brightness-110 hover:-translate-y-0.5"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Create free account
            <span className="text-xl leading-none">→</span>
          </button>
        </Link>

        {/* Footer */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-8 sm:mt-20">
          <div className="flex items-center gap-2">
            <div className="bg-primary flex size-5 items-center justify-center rounded-[4px]">
              <span
                className="text-primary-foreground"
                style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700 }}
              >
                K
              </span>
            </div>
            <span
              className="text-muted-foreground"
              style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13 }}
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
