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
    <section
      style={{
        backgroundColor: "oklch(0.115 0.012 240)",
        borderTop: "1px solid oklch(1 0 0 / 0.06)",
        borderBottom: "1px solid oklch(1 0 0 / 0.06)",
        padding: "100px 24px",
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
            How it works
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
            From inbox to insight,{" "}
            <em style={{ fontStyle: "italic", color: "oklch(0.75 0.04 150)" }}>
              automatically.
            </em>
          </h2>
        </div>

        {/* Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.number}
              style={{
                position: "relative",
                padding: "36px 32px",
                background:
                  i === 1
                    ? "oklch(0.14 0.016 240)"
                    : "oklch(0.13 0.013 240)",
                border: "1px solid oklch(1 0 0 / 0.07)",
                borderRadius: i === 0 ? "12px 0 0 12px" : i === 2 ? "0 12px 12px 0" : "0",
              }}
            >
              {/* Step number */}
              <div
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "oklch(0.527 0.154 150.069)",
                  letterSpacing: "0.1em",
                  marginBottom: 20,
                }}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div
                style={{
                  fontSize: 28,
                  color: "oklch(0.97 0.012 80)",
                  marginBottom: 16,
                  lineHeight: 1,
                }}
              >
                {step.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 26,
                  fontWeight: 400,
                  color: "oklch(0.97 0.012 80)",
                  marginBottom: 12,
                  lineHeight: 1.2,
                }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "oklch(0.58 0.02 80)",
                }}
              >
                {step.description}
              </p>

              {/* Connector arrow (between cards) */}
              {i < 2 && (
                <div
                  style={{
                    position: "absolute",
                    right: -14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                    width: 26,
                    height: 26,
                    background: "oklch(0.527 0.154 150.069)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    color: "oklch(0.09 0.008 240)",
                    fontWeight: 700,
                  }}
                >
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
