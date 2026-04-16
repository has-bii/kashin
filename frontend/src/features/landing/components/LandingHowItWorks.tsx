const steps = [
  {
    number: "01",
    icon: "✉",
    title: "Connect Gmail",
    description:
      "Authorize Kashin with read-only Gmail access. Your credentials never touch our servers.",
  },
  {
    number: "02",
    icon: "✦",
    title: "AI reads receipts",
    description:
      "Our LLM scans incoming purchase confirmations, shipping alerts, and receipts to extract merchant, amount, date, and category.",
  },
  {
    number: "03",
    icon: "◈",
    title: "Dashboard fills itself",
    description:
      "Extracted transactions queue for your review. Confirm or reject with one click — your ledger stays accurate.",
  },
]

export function LandingHowItWorks() {
  return (
    <section className="bg-card border-y border-border px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <p
            className="text-primary mb-3 uppercase tracking-[0.12em]"
            style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11, fontWeight: 600 }}
          >
            How it works
          </p>
          <h2
            className="text-foreground text-[clamp(30px,4vw,52px)] leading-[1.15]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
          >
            From inbox to insight,{" "}
            <em className="text-primary italic">automatically.</em>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="border-border bg-background relative border p-6 sm:p-8 md:p-9 first:rounded-xl md:first:rounded-l-xl md:first:rounded-r-none last:rounded-xl md:last:rounded-r-xl md:last:rounded-l-none max-md:not-first:not-last:rounded-none"
            >
              {/* Step number */}
              <div
                className="text-primary mb-5 tracking-[0.1em]"
                style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, fontWeight: 600 }}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div className="text-foreground mb-4 text-[28px] leading-none">
                {step.icon}
              </div>

              {/* Title */}
              <h3
                className="text-foreground mb-3 text-xl leading-[1.2] sm:text-2xl md:text-[26px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                className="text-muted-foreground leading-[1.7]"
                style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14 }}
              >
                {step.description}
              </p>

              {/* Connector arrow — hidden on mobile */}
              {i < 2 && (
                <div className="bg-primary text-primary-foreground absolute right-[-14px] top-1/2 z-1 hidden size-[26px] -translate-y-1/2 items-center justify-center rounded-full text-[11px] font-bold md:flex">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
