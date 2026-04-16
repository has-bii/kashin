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
      style={{
        backgroundColor: "oklch(0.09 0.008 240)",
        padding: "100px 24px",
        backgroundImage: `
          linear-gradient(oklch(1 0 0 / 0.025) 1px, transparent 1px),
          linear-gradient(90deg, oklch(1 0 0 / 0.025) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: 64 }}>
          <p
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 11,
              fontWeight: 600,
              color: "oklch(0.527 0.154 150.069)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Features
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 4vw, 52px)",
              fontWeight: 300,
              color: "oklch(0.97 0.012 80)",
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
      style={{
        padding: "36px 32px",
        background: "oklch(0.13 0.013 240)",
        border: "1px solid oklch(1 0 0 / 0.07)",
        borderRadius,
        transition: "background 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "oklch(0.155 0.018 240)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "oklch(0.13 0.013 240)"
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          background: "oklch(0.527 0.154 150.069 / 0.12)",
          border: "1px solid oklch(0.527 0.154 150.069 / 0.25)",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          color: "oklch(0.85 0.08 150)",
          marginBottom: 20,
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 500,
          color: "oklch(0.97 0.012 80)",
          marginBottom: 10,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: 14,
          lineHeight: 1.7,
          color: "oklch(0.55 0.018 80)",
        }}
      >
        {description}
      </p>
    </div>
  )
}
