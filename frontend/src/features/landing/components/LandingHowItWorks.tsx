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
      className="bg-card border-y border-border"
      style={{ padding: "100px 24px" }}
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
            How it works
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
            From inbox to insight,{" "}
            <em className="text-primary" style={{ fontStyle: "italic" }}>
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
              className="bg-background border-border"
              style={{
                position: "relative",
                padding: "36px 32px",
                border: "1px solid var(--border)",
                borderRadius:
                  i === 0 ? "12px 0 0 12px" : i === 2 ? "0 12px 12px 0" : "0",
              }}
            >
              {/* Step number */}
              <div
                className="text-primary"
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  marginBottom: 20,
                }}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div
                className="text-foreground"
                style={{
                  fontSize: 28,
                  marginBottom: 16,
                  lineHeight: 1,
                }}
              >
                {step.icon}
              </div>

              {/* Title */}
              <h3
                className="text-foreground"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 26,
                  fontWeight: 400,
                  marginBottom: 12,
                  lineHeight: 1.2,
                }}
              >
                {step.title}
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
                {step.description}
              </p>

              {/* Connector arrow */}
              {i < 2 && (
                <div
                  className="bg-primary text-primary-foreground"
                  style={{
                    position: "absolute",
                    right: -14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
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
