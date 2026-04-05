import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("@tanstack/react-query", () => ({
  useSuspenseQuery: vi.fn(),
}))

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: vi.fn(),
  },
}))

vi.mock("@/features/dashboard/api/get-dashboard-recent.query", () => ({
  getDashboardRecentQueryOptions: vi.fn(() => ({ queryKey: ["dashboard", "recent"] })),
}))

import { useSuspenseQuery } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import { RecentTransactionsWidget } from "@/features/dashboard/components/RecentTransactionsWidget"
import type { Transaction } from "@/features/dashboard/types"

const mockUseSuspenseQuery = vi.mocked(useSuspenseQuery)
const mockUseSession = vi.mocked(authClient.useSession)

afterEach(() => {
  cleanup()
})

function setupSession() {
  mockUseSession.mockReturnValue({
    data: { user: { currency: "USD" } },
  } as unknown as ReturnType<typeof authClient.useSession>)
}

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: "tx-1",
    userId: "user-1",
    categoryId: "cat-1",
    type: "expense",
    amount: "42.50",
    currency: "USD",
    transactionDate: "2024-01-15T00:00:00.000Z",
    description: "Grocery run",
    notes: null,
    source: null,
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z",
    category: {
      id: "cat-1",
      name: "Food",
      type: "expense",
      icon: "🛒",
      color: "#ff0000",
    },
    ...overrides,
  }
}

describe("RecentTransactionsWidget", () => {
  it("renders list of transactions with category, description, and amount", () => {
    setupSession()
    const tx = makeTransaction()
    mockUseSuspenseQuery.mockReturnValue({ data: [tx] } as ReturnType<typeof useSuspenseQuery>)

    render(<RecentTransactionsWidget />)

    expect(screen.getByText("Recent Transactions")).toBeInTheDocument()
    expect(screen.getByText("Food")).toBeInTheDocument()
    expect(screen.getByText("Grocery run")).toBeInTheDocument()
    // expense amount contains 42.50 with a minus prefix (format: -$42.50)
    expect(screen.getByText(/42\.50/)).toBeInTheDocument()
  })

  it("shows income amount in positive color class and expense in destructive", () => {
    setupSession()
    const income = makeTransaction({ id: "tx-2", type: "income", amount: "1000.00", description: "Salary" })
    mockUseSuspenseQuery.mockReturnValue({ data: [income] } as ReturnType<typeof useSuspenseQuery>)

    render(<RecentTransactionsWidget />)

    // income formatted as +$1,000.00 — match the numeric portion
    const amountEl = screen.getByText(/1,000/)
    expect(amountEl.className).toContain("text-primary")
  })

  it("shows empty state when no transactions", () => {
    setupSession()
    mockUseSuspenseQuery.mockReturnValue({ data: [] } as ReturnType<typeof useSuspenseQuery>)

    render(<RecentTransactionsWidget />)

    expect(screen.getByText("No transactions yet")).toBeInTheDocument()
    expect(screen.getByText("Add your first transaction to get started.")).toBeInTheDocument()
  })
})
