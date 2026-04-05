import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { describe, expect, it, vi } from "vitest"

// Mock useSuspenseQuery to return controlled data
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>()
  return {
    ...actual,
    useSuspenseQuery: vi.fn(),
  }
})

// Mock recharts to avoid SVG rendering issues in jsdom
vi.mock("recharts", () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

// Mock shadcn chart components
vi.mock("@/components/ui/chart", () => ({
  ChartContainer: ({
    children,
    config: _config,
  }: {
    children: React.ReactNode
    config: unknown
  }) => <div data-testid="chart-container">{children}</div>,
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
  ChartLegend: () => null,
  ChartLegendContent: () => null,
}))

// Mock auth client
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: vi.fn(() => ({
      data: { user: { currency: "USD" } },
      isPending: false,
    })),
  },
}))

const mockTrendsData = [
  { month: "2024-01", income: 5000, expense: 3000 },
  { month: "2024-02", income: 4500, expense: 2800 },
  { month: "2024-03", income: 6000, expense: 3500 },
]

describe("MonthlyTrendsChart", () => {
  it("renders bar chart with monthly data and title", async () => {
    const { useSuspenseQuery } = await import("@tanstack/react-query")
    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: mockTrendsData,
    } as ReturnType<typeof useSuspenseQuery>)

    const { MonthlyTrendsChart } = await import(
      "@/features/dashboard/components/MonthlyTrendsChart"
    )

    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <MonthlyTrendsChart />
      </QueryClientProvider>,
    )

    expect(screen.getByText("Monthly Trends")).toBeDefined()
    expect(screen.getByTestId("bar-chart")).toBeDefined()
  })

  it("shows empty state when no data", async () => {
    const { useSuspenseQuery } = await import("@tanstack/react-query")
    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: [],
    } as ReturnType<typeof useSuspenseQuery>)

    const { MonthlyTrendsChart } = await import(
      "@/features/dashboard/components/MonthlyTrendsChart"
    )

    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <MonthlyTrendsChart />
      </QueryClientProvider>,
    )

    expect(screen.getByText("No transactions this period")).toBeDefined()
  })

  it("changes months param when toggle is clicked", async () => {
    const { useSuspenseQuery } = await import("@tanstack/react-query")
    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: mockTrendsData,
    } as ReturnType<typeof useSuspenseQuery>)

    const { MonthlyTrendsChart } = await import(
      "@/features/dashboard/components/MonthlyTrendsChart"
    )

    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <MonthlyTrendsChart />
      </QueryClientProvider>,
    )

    const toggleButtons = screen.getAllByText("3m")
    const toggle3m = toggleButtons[0]
    expect(toggle3m).toBeDefined()
    await userEvent.click(toggle3m)
    // After clicking 3m, the description should show "3 months"
    expect(screen.getByText(/3 months/)).toBeDefined()
  })
})
