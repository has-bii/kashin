export function MockReceiptCard() {
  return (
    <div
      style={{
        animation: "landing-float 5s ease-in-out infinite",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          width: 340,
          background:
            "linear-gradient(145deg, oklch(0.16 0.018 240), oklch(0.13 0.012 240))",
          border: "1px solid oklch(1 0 0 / 0.1)",
          borderRadius: 16,
          padding: "24px",
          boxShadow:
            "0 40px 80px -20px oklch(0 0 0 / 0.6), 0 0 0 1px oklch(1 0 0 / 0.05), inset 0 1px 0 oklch(1 0 0 / 0.08)",
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
              "linear-gradient(90deg, transparent, oklch(0.527 0.154 150.069 / 0.6), transparent)",
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
              style={{
                width: 22,
                height: 22,
                background: "oklch(0.527 0.154 150.069)",
                borderRadius: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "oklch(0.09 0.008 240)",
                }}
              >
                K
              </span>
            </div>
            <span
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 13,
                fontWeight: 500,
                color: "oklch(0.97 0.012 80)",
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
              background: "oklch(0.527 0.154 150.069 / 0.15)",
              border: "1px solid oklch(0.527 0.154 150.069 / 0.3)",
              borderRadius: 20,
              padding: "3px 10px",
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "oklch(0.527 0.154 150.069)",
                animation: "landing-pulse-dot 1.5s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 10,
                fontWeight: 600,
                color: "oklch(0.527 0.154 150.069)",
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
          style={{
            background: "oklch(0.11 0.01 240 / 0.8)",
            border: "1px solid oklch(1 0 0 / 0.07)",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 10,
              color: "oklch(0.6 0.02 80)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Email source
          </p>
          <p
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 12,
              color: "oklch(0.75 0.04 200)",
            }}
          >
            auto-confirm@amazon.com
          </p>
          <p
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 11,
              color: "oklch(0.55 0.015 80)",
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
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 10,
                  color: "oklch(0.5 0.015 80)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                Merchant
              </p>
              <p
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "oklch(0.97 0.012 80)",
                }}
              >
                Amazon.com
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 10,
                  color: "oklch(0.5 0.015 80)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                Amount
              </p>
              <p
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "oklch(0.97 0.012 80)",
                }}
              >
                $94.99
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 10,
                  color: "oklch(0.5 0.015 80)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                Date
              </p>
              <p
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 13,
                  color: "oklch(0.8 0.02 80)",
                }}
              >
                Apr 14, 2026
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 10,
                  color: "oklch(0.5 0.015 80)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                Category
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: "oklch(0.2 0.015 240)",
                  border: "1px solid oklch(1 0 0 / 0.08)",
                  borderRadius: 6,
                  padding: "2px 8px",
                }}
              >
                <span style={{ fontSize: 11 }}>🛍</span>
                <span
                  style={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: 11,
                    color: "oklch(0.75 0.02 80)",
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
            style={{
              flex: 1,
              background: "oklch(0.527 0.154 150.069)",
              border: "none",
              borderRadius: 8,
              padding: "9px 0",
              fontFamily: "var(--font-geist-sans)",
              fontSize: 12,
              fontWeight: 600,
              color: "oklch(0.09 0.008 240)",
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            ✓ Confirm
          </button>
          <button
            style={{
              flex: 1,
              background: "oklch(0.18 0.015 240)",
              border: "1px solid oklch(1 0 0 / 0.08)",
              borderRadius: 8,
              padding: "9px 0",
              fontFamily: "var(--font-geist-sans)",
              fontSize: 12,
              fontWeight: 500,
              color: "oklch(0.55 0.015 80)",
              cursor: "pointer",
            }}
          >
            ✕ Reject
          </button>
        </div>
      </div>
    </div>
  )
}
