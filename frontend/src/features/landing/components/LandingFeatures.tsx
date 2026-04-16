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
      className="bg-background"
      style={{
        padding: "100px 24px",
        backgroundImage: `
          linear-gradient(color-mix(in oklch, var(--border) 50%, transparent) 1px, transparent 1px),
          linear-gradient(90deg, color-mix(in oklch, var(--border) 50%, transparent) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: 64 }}>
          <p
            className="text-primary"
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Features
          </p>
          <h2
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 4vw, 52px)",
              fontWeight: 300,
              lineHeight: 1.15,
            }}
          >
            Everything your finances need.
          </h2>
        </div>

        {/* Feature grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
          }}
        >
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} index={i} />
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
  index,
}: {
  icon: string
  title: string
  description: string
  index: number
}) {
  const isTopRow = index < 3
  const isBottomRow = index >= 3
  const isLeftCol = index % 3 === 0
  const isRightCol = index % 3 === 2

  const borderRadius = `${isTopRow && isLeftCol ? 12 : 0}px ${isTopRow && isRightCol ? 12 : 0}px ${isBottomRow && isRightCol ? 12 : 0}px ${isBottomRow && isLeftCol ? 12 : 0}px`

  return (
    <div
      className="bg-card border-border transition-colors hover:bg-muted"
      style={{
        padding: "36px 32px",
        border: "1px solid var(--border)",
        borderRadius,
        cursor: "default",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          background: "color-mix(in oklch, var(--primary) 12%, transparent)",
          border: "1px solid color-mix(in oklch, var(--primary) 25%, transparent)",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          color: "var(--primary)",
          marginBottom: 20,
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className="text-foreground"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 500,
          marginBottom: 10,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="text-muted-foreground"
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        {description}
      </p>
    </div>
  )
}
