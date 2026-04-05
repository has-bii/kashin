import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen } from "@testing-library/react"
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
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie">{children}</div>
  ),
  Cell: () => null,
  Label: () => null,
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

const mockCategoryData = [
  {
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Food", icon: "🍔", color: "#ff0000" },
    total: 500,
  },
  {
    categoryId: "cat-2",
    category: { id: "cat-2", name: "Transport", icon: "🚗", color: "#0000ff" },
    total: 200,
  },
]

describe("CategoryBreakdownChart", () => {
  it("renders donut chart with category data and title", async () => {
    const { useSuspenseQuery } = await import("@tanstack/react-query")
    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: mockCategoryData,
    } as ReturnType<typeof useSuspenseQuery>)

    const { CategoryBreakdownChart } = await import(
      "@/features/dashboard/components/CategoryBreakdownChart"
    )

    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <CategoryBreakdownChart />
      </QueryClientProvider>,
    )

    expect(screen.getByText("Spending by Category")).toBeDefined()
    expect(screen.getByTestId("pie-chart")).toBeDefined()
  })

  it("shows empty state when no spending data", async () => {
    const { useSuspenseQuery } = await import("@tanstack/react-query")
    vi.mocked(useSuspenseQuery).mockReturnValue({
      data: [],
    } as ReturnType<typeof useSuspenseQuery>)

    const { CategoryBreakdownChart } = await import(
      "@/features/dashboard/components/CategoryBreakdownChart"
    )

    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <CategoryBreakdownChart />
      </QueryClientProvider>,
    )

    expect(screen.getByText("No spending this month")).toBeDefined()
  })
})
