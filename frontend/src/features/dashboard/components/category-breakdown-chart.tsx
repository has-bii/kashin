"use client"

import { getDashboardCategoryBreakdownQueryOptions } from "../api/get-dashboard-category-breakdown.query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getUserQueryOptions } from "@/features/auth/hooks/use-get-user"
import { formatCurrency } from "@/lib/locale-utils"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Cell, Label, Pie, PieChart } from "recharts"

const FALLBACK_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export default function CategoryBreakdownChart() {
  const { data } = useSuspenseQuery(getDashboardCategoryBreakdownQueryOptions({}))
  const {
    data: { user },
  } = useSuspenseQuery(getUserQueryOptions())
  const currency = user.currency.code

  const chartConfig: ChartConfig = data.reduce<ChartConfig>((acc, item, index) => {
    const key = item.categoryId ?? `unknown-${index}`
    acc[key] = {
      label: item.category?.name ?? "Unknown",
      color: item.category?.color || FALLBACK_COLORS[index % 5],
    }
    return acc
  }, {})

  const totalExpenses = data.reduce((sum, item) => sum + item.total, 0)

  const formattedTotal = formatCurrency(totalExpenses, currency)

  const MAX_LEGEND_ITEMS = 6
  const legendItems =
    data.length > MAX_LEGEND_ITEMS
      ? [
          ...data.slice(0, MAX_LEGEND_ITEMS - 1),
          {
            categoryId: "__more__",
            category: {
              id: "__more__",
              name: `+${data.length - (MAX_LEGEND_ITEMS - 1)} more`,
              icon: "",
              color: "var(--muted-foreground)",
            },
            total: data.slice(MAX_LEGEND_ITEMS - 1).reduce((sum, i) => sum + i.total, 0),
          },
        ]
      : data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Current month</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-muted-foreground flex h-[300px] items-center justify-center text-sm">
            No spending this month
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="categoryId"
                innerRadius={60}
                strokeWidth={5}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.categoryId ?? index}
                    fill={entry.category?.color || FALLBACK_COLORS[index % 5]}
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-lg font-bold"
                          >
                            {formattedTotal}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-xs"
                          >
                            Total
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        )}
        {data.length > 0 && (
          <ul className="mt-4 space-y-1">
            {legendItems.map((item, index) => {
              const color = item.category?.color || FALLBACK_COLORS[index % 5]
              const amount = formatCurrency(item.total, currency)
              return (
                <li
                  key={item.categoryId ?? index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {item.category?.name ?? "Unknown"}
                  </span>
                  <span className="text-muted-foreground">{amount}</span>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
