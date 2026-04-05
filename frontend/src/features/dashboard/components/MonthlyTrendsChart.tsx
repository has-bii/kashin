"use client"

import { useState } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { formatInTimeZone } from "date-fns-tz"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { getDashboardTrendsQueryOptions } from "../api/get-dashboard-trends.query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { authClient, type UserWithProfile } from "@/lib/auth-client"

const chartConfig = {
  income: { label: "Income", color: "var(--primary)" },
  expense: { label: "Expenses", color: "var(--destructive)" },
} satisfies ChartConfig

export function MonthlyTrendsChart() {
  const [months, setMonths] = useState(6)
  const { data } = useSuspenseQuery(getDashboardTrendsQueryOptions({ months }))
  const session = authClient.useSession()
  const timezone = (session?.data?.user as UserWithProfile | undefined)?.timezone ?? "Asia/Jakarta"
  const t = useTranslations("dashboard.monthlyTrends")

  const mappedData = data.map((item) => ({
    label: formatInTimeZone(item.month + "-01", timezone, "MMM"),
    income: item.income,
    expense: item.expense,
  }))

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description", { count: months, defaultValue: `Income vs. expenses over the last ${months} months` })}</CardDescription>
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
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            {t("noData")}
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
