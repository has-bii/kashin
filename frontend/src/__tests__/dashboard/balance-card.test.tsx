import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

// Mock useSuspenseQuery
vi.mock("@tanstack/react-query", () => ({
  useSuspenseQuery: vi.fn(),
}))

// Mock authClient
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: vi.fn(),
  },
}))

// Mock query options
vi.mock("@/features/dashboard/api/get-dashboard-summary.query", () => ({
  getDashboardSummaryQueryOptions: vi.fn(() => ({ queryKey: ["dashboard", "summary"] })),
}))

import { useSuspenseQuery } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import { SectionCards } from "@/features/dashboard/components/SectionCards"

const mockUseSuspenseQuery = vi.mocked(useSuspenseQuery)
const mockUseSession = vi.mocked(authClient.useSession)

afterEach(() => {
  cleanup()
})

function setup(data: { totalIncome: number; totalExpense: number; netBalance: number }) {
  mockUseSuspenseQuery.mockReturnValue({ data } as ReturnType<typeof useSuspenseQuery>)
  mockUseSession.mockReturnValue({
    data: { user: { currency: "USD" } },
  } as unknown as ReturnType<typeof authClient.useSession>)
}

describe("SectionCards", () => {
  it("renders total income from API data", () => {
    setup({ totalIncome: 5000, totalExpense: 2000, netBalance: 3000 })
    render(<SectionCards />)
    expect(screen.getByText("Total Income")).toBeInTheDocument()
    expect(screen.getByText(/5,000/)).toBeInTheDocument()
  })

  it("renders total expenses from API data", () => {
    setup({ totalIncome: 5000, totalExpense: 2000, netBalance: 3000 })
    render(<SectionCards />)
    expect(screen.getByText("Total Expenses")).toBeInTheDocument()
    expect(screen.getByText(/2,000/)).toBeInTheDocument()
  })

  it("renders net balance with primary badge when positive", () => {
    setup({ totalIncome: 5000, totalExpense: 2000, netBalance: 3000 })
    render(<SectionCards />)
    expect(screen.getByText("Net Balance")).toBeInTheDocument()
    expect(screen.getByText("Income exceeds expenses")).toBeInTheDocument()
  })

  it("renders net balance with destructive badge when negative", () => {
    setup({ totalIncome: 2000, totalExpense: 5000, netBalance: -3000 })
    render(<SectionCards />)
    expect(screen.getByText("Net Balance")).toBeInTheDocument()
    expect(screen.getByText("Expenses exceed income")).toBeInTheDocument()
  })

  it("renders savings rate computed from income and net balance", () => {
    // 3000 / 5000 * 100 = 60%
    setup({ totalIncome: 5000, totalExpense: 2000, netBalance: 3000 })
    render(<SectionCards />)
    expect(screen.getByText("Savings Rate")).toBeInTheDocument()
    expect(screen.getByText("60.0%")).toBeInTheDocument()
  })

  it("shows dash when total income is zero", () => {
    setup({ totalIncome: 0, totalExpense: 0, netBalance: 0 })
    render(<SectionCards />)
    expect(screen.getByText("Savings Rate")).toBeInTheDocument()
    expect(screen.getByText("—")).toBeInTheDocument()
  })

  it("renders net balance with no-change badge when zero", () => {
    setup({ totalIncome: 1000, totalExpense: 1000, netBalance: 0 })
    render(<SectionCards />)
    expect(screen.getByText("No change")).toBeInTheDocument()
  })
})
