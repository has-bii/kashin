"use client"

import { getDashboardTrendsQueryOptions } from "../api/get-dashboard-trends.query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { TIMEZONE } from "@/constants/indonesia"
import { useSuspenseQuery } from "@tanstack/react-query"
import { formatInTimeZone } from "date-fns-tz"
import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const chartConfig = {
  income: { label: "Income", color: "var(--primary)" },
  expense: { label: "Expenses", color: "var(--destructive)" },
} satisfies ChartConfig

export default function MonthlyTrendsChart() {
  const [months, setMonths] = useState(6)
  const { data } = useSuspenseQuery(getDashboardTrendsQueryOptions({ months }))
  const mappedData = data.map((item) => ({
    label: formatInTimeZone(item.month + "-01", TIMEZONE, "MMM"),
    income: item.income,
    expense: item.expense,
  }))

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>{`Income vs. expenses over the last ${months} months`}</CardDescription>
        </div>
        <ToggleGroup
          type="single"
          value={String(months)}
          onValueChange={(v) => {
            if (v) setMonths(Number(v))
          }}
        >
          <ToggleGroupItem value="3">3m</ToggleGroupItem>
          <ToggleGroupItem value="6">6m</ToggleGroupItem>
          <ToggleGroupItem value="12">12m</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-muted-foreground flex h-[300px] items-center justify-center text-sm">
            No transactions this period
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={mappedData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
