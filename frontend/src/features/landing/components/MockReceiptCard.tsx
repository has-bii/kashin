export function MockReceiptCard() {
  return (
    <div
      style={{
        animation: "landing-float 5s ease-in-out infinite",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="bg-card border-border"
        style={{
          width: 340,
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "24px",
          boxShadow:
            "0 40px 80px -20px color-mix(in oklch, var(--background) 40%, transparent), 0 0 0 1px color-mix(in oklch, var(--foreground) 5%, transparent), inset 0 1px 0 color-mix(in oklch, var(--foreground) 8%, transparent)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Scan line animation */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, color-mix(in oklch, var(--primary) 60%, transparent), transparent)",
            animation: "landing-scan-line 3s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* Card header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              className="bg-primary flex items-center justify-center"
              style={{ width: 22, height: 22, borderRadius: 5 }}
            >
              <span
                className="text-primary-foreground"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                K
              </span>
            </div>
            <span
              className="text-foreground"
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}
            >
              KASHIN
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "color-mix(in oklch, var(--primary) 15%, transparent)",
              border: "1px solid color-mix(in oklch, var(--primary) 30%, transparent)",
              borderRadius: 20,
              padding: "3px 10px",
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--primary)",
                animation: "landing-pulse-dot 1.5s ease-in-out infinite",
              }}
            />
            <span
              className="text-primary"
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              AI Extracted
            </span>
          </div>
        </div>

        {/* Email source */}
        <div
          className="bg-muted border-border"
          style={{
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 20,
          }}
        >
          <p
            className="text-muted-foreground"
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 10,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Email source
          </p>
          <p
            className="text-primary"
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 12,
            }}
          >
            auto-confirm@amazon.com
          </p>
          <p
            className="text-muted-foreground"
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 11,
              marginTop: 2,
            }}
          >
            "Your Amazon.com order has shipped"
          </p>
        </div>

        {/* Transaction details */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px 8px",
            }}
          >
            <div>
              <p
                className="text-muted-foreground"
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                Merchant
              </p>
              <p
                className="text-foreground"
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Amazon.com
              </p>
            </div>
            <div>
              <p
                className="text-muted-foreground"
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                Amount
              </p>
              <p
                className="text-foreground"
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                $94.99
              </p>
            </div>
            <div>
              <p
                className="text-muted-foreground"
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                Date
              </p>
              <p
                className="text-foreground"
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 13,
                }}
              >
                Apr 14, 2026
              </p>
            </div>
            <div>
              <p
                className="text-muted-foreground"
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                Category
              </p>
              <div
                className="bg-muted border-border inline-flex items-center gap-1"
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "2px 8px",
                }}
              >
                <span style={{ fontSize: 11 }}>🛍</span>
                <span
                  className="text-muted-foreground"
                  style={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: 11,
                  }}
                >
                  Shopping
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="bg-primary text-primary-foreground cursor-pointer"
            style={{
              flex: 1,
              border: "none",
              borderRadius: 8,
              padding: "9px 0",
              fontFamily: "var(--font-geist-sans)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            ✓ Confirm
          </button>
          <button
            className="bg-muted text-muted-foreground border-border cursor-pointer"
            style={{
              flex: 1,
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "9px 0",
              fontFamily: "var(--font-geist-sans)",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            ✕ Reject
          </button>
        </div>
      </div>
    </div>
  )
}
