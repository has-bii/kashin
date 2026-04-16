const features = [
  {
    icon: "✦",
    title: "AI Extraction",
    description:
      "LangChain + Google GenAI reads your email receipts and extracts merchant, amount, date, and category with high accuracy.",
  },
  {
    icon: "◎",
    title: "Budget Tracking",
    description:
      "Set monthly budgets per category and watch your spending in real time. Alerts fire before you overshoot.",
  },
  {
    icon: "⟳",
    title: "Recurring Detection",
    description:
      "Kashin flags subscriptions and recurring charges so you always know what's hitting your account every month.",
  },
  {
    icon: "⊞",
    title: "Smart Categories",
    description:
      "AI suggests categories from merchant names. Customize the taxonomy to match how you think about money.",
  },
  {
    icon: "⬡",
    title: "Bank Accounts",
    description:
      "Track balances across multiple accounts and cards in one unified view, manually or via import.",
  },
  {
    icon: "✉",
    title: "Gmail Integration",
    description:
      "Native OAuth connection — no forwarding addresses, no third-party apps, no manual CSV exports.",
  },
]

export function LandingFeatures() {
  return (
    <section
      className="bg-background px-4 py-16 sm:px-6 md:py-24"
      style={{
        backgroundImage: `
          linear-gradient(color-mix(in oklch, var(--border) 50%, transparent) 1px, transparent 1px),
          linear-gradient(90deg, color-mix(in oklch, var(--border) 50%, transparent) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
      }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <p
            className="text-primary mb-3 uppercase tracking-[0.12em]"
            style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11, fontWeight: 600 }}
          >
            Features
          </p>
          <h2
            className="text-foreground text-[clamp(30px,4vw,52px)] leading-[1.15]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
          >
            Everything your finances need.
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-px sm:overflow-hidden sm:rounded-xl lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div
      className="border-border bg-card cursor-default border p-6 transition-colors hover:bg-muted sm:p-8 md:p-9 rounded-xl sm:rounded-none"
    >
      {/* Icon */}
      <div
        className="mb-5 flex size-11 items-center justify-center rounded-[10px] text-xl"
        style={{
          background: "color-mix(in oklch, var(--primary) 12%, transparent)",
          border: "1px solid color-mix(in oklch, var(--primary) 25%, transparent)",
          color: "var(--primary)",
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className="text-foreground mb-2.5 text-lg leading-[1.2] sm:text-xl md:text-[22px]"
        style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="text-muted-foreground leading-[1.7]"
        style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14 }}
      >
        {description}
      </p>
    </div>
  )
}
