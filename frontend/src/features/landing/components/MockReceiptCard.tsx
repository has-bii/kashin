export function MockReceiptCard() {
  return (
    <div
      style={{
        animation: "landing-float 5s ease-in-out infinite",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="border-border bg-card relative w-72 overflow-hidden rounded-2xl border p-6 lg:w-[340px]"
        style={{
          boxShadow:
            "0 40px 80px -20px color-mix(in oklch, var(--background) 40%, transparent), 0 0 0 1px color-mix(in oklch, var(--foreground) 5%, transparent), inset 0 1px 0 color-mix(in oklch, var(--foreground) 8%, transparent)",
        }}
      >
        {/* Scan line animation */}
        <div
          className="pointer-events-none absolute left-0 right-0 h-0.5"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in oklch, var(--primary) 60%, transparent), transparent)",
            animation: "landing-scan-line 3s ease-in-out infinite",
          }}
        />

        {/* Card header */}
        <div className="mb-[18px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary flex size-[22px] items-center justify-center rounded-[5px]">
              <span
                className="text-primary-foreground"
                style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700 }}
              >
                K
              </span>
            </div>
            <span
              className="text-foreground tracking-[0.02em]"
              style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, fontWeight: 500 }}
            >
              KASHIN
            </span>
          </div>
          <div
            className="flex items-center gap-[5px] rounded-full px-[10px] py-[3px]"
            style={{
              background: "color-mix(in oklch, var(--primary) 15%, transparent)",
              border: "1px solid color-mix(in oklch, var(--primary) 30%, transparent)",
            }}
          >
            <div
              className="size-[5px] rounded-full bg-primary"
              style={{ animation: "landing-pulse-dot 1.5s ease-in-out infinite" }}
            />
            <span
              className="text-primary uppercase tracking-[0.08em]"
              style={{ fontFamily: "var(--font-geist-sans)", fontSize: 10, fontWeight: 600 }}
            >
              AI Extracted
            </span>
          </div>
        </div>

        {/* Email source */}
        <div
          className="border-border bg-muted mb-5 rounded-lg border p-[10px_14px]"
        >
          <p
            className="text-muted-foreground mb-1 uppercase tracking-[0.06em]"
            style={{ fontFamily: "var(--font-geist-sans)", fontSize: 10 }}
          >
            Email source
          </p>
          <p
            className="text-primary"
            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
          >
            auto-confirm@amazon.com
          </p>
          <p
            className="text-muted-foreground mt-0.5"
            style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11 }}
          >
            &quot;Your Amazon.com order has shipped&quot;
          </p>
        </div>

        {/* Transaction details */}
        <div className="mb-5">
          <div className="grid grid-cols-2 gap-x-2 gap-y-3">
            <div>
              <p
                className="text-muted-foreground mb-[3px] uppercase tracking-[0.06em]"
                style={{ fontFamily: "var(--font-geist-sans)", fontSize: 10 }}
              >
                Merchant
              </p>
              <p
                className="text-foreground"
                style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, fontWeight: 500 }}
              >
                Amazon.com
              </p>
            </div>
            <div>
              <p
                className="text-muted-foreground mb-[3px] uppercase tracking-[0.06em]"
                style={{ fontFamily: "var(--font-geist-sans)", fontSize: 10 }}
              >
                Amount
              </p>
              <p
                className="text-foreground"
                style={{ fontFamily: "var(--font-geist-mono)", fontSize: 18, fontWeight: 600 }}
              >
                $94.99
              </p>
            </div>
            <div>
              <p
                className="text-muted-foreground mb-[3px] uppercase tracking-[0.06em]"
                style={{ fontFamily: "var(--font-geist-sans)", fontSize: 10 }}
              >
                Date
              </p>
              <p
                className="text-foreground"
                style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13 }}
              >
                Apr 14, 2026
              </p>
            </div>
            <div>
              <p
                className="text-muted-foreground mb-[3px] uppercase tracking-[0.06em]"
                style={{ fontFamily: "var(--font-geist-sans)", fontSize: 10 }}
              >
                Category
              </p>
              <div className="border-border bg-muted inline-flex items-center gap-1 rounded-md border px-2 py-[2px]">
                <span className="text-[11px]">🛍</span>
                <span
                  className="text-muted-foreground"
                  style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11 }}
                >
                  Shopping
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            className="bg-primary text-primary-foreground cursor-pointer flex-1 rounded-lg border-none py-[9px] tracking-[0.02em]"
            style={{ fontFamily: "var(--font-geist-sans)", fontSize: 12, fontWeight: 600 }}
          >
            ✓ Confirm
          </button>
          <button
            className="bg-muted text-muted-foreground border-border cursor-pointer flex-1 rounded-lg border py-[9px]"
            style={{ fontFamily: "var(--font-geist-sans)", fontSize: 12, fontWeight: 500 }}
          >
            ✕ Reject
          </button>
        </div>
      </div>
    </div>
  )
}
