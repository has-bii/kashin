"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { getDashboardSummaryQueryOptions } from "../api/get-dashboard-summary.query"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { authClient, type UserWithProfile } from "@/lib/auth-client"
import { formatCurrency } from "@/lib/locale-utils"

export function SectionCards() {
  const { data } = useSuspenseQuery(getDashboardSummaryQueryOptions({}))
  const { totalIncome, totalExpense, netBalance } = data

  const session = authClient.useSession()
  const currency = (session?.data?.user as UserWithProfile | undefined)?.currency ?? "IDR"
  const t = useTranslations("dashboard.section")

  const formatAmount = (value: number) => formatCurrency(value, currency)

  const savingsRate = totalIncome === 0 ? null : (netBalance / totalIncome) * 100

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {/* Card 1 — Total Income */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t("totalIncome")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatAmount(totalIncome)}
          </CardTitle>
        </CardHeader>
        <CardFooter>{t("currentMonth")}</CardFooter>
      </Card>

      {/* Card 2 — Total Expenses */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t("totalExpenses")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatAmount(totalExpense)}
          </CardTitle>
        </CardHeader>
        <CardFooter>{t("currentMonth")}</CardFooter>
      </Card>

      {/* Card 3 — Net Balance */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t("netBalance")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatAmount(netBalance)}
          </CardTitle>
          <CardAction>
            {netBalance > 0 && (
              <Badge variant="outline" className="text-primary">
                <TrendingUpIcon />
                {t("incomeExceeds")}
              </Badge>
            )}
            {netBalance < 0 && (
              <Badge variant="outline" className="text-destructive">
                <TrendingDownIcon />
                {t("expensesExceed")}
              </Badge>
            )}
            {netBalance === 0 && <Badge variant="outline">{t("noChange")}</Badge>}
          </CardAction>
        </CardHeader>
        <CardFooter>{t("currentMonth")}</CardFooter>
      </Card>

      {/* Card 4 — Savings Rate */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t("savingsRate")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {savingsRate === null ? "\u2014" : `${savingsRate.toFixed(1)}%`}
          </CardTitle>
          {savingsRate !== null && (
            <CardAction>
              {savingsRate >= 0 ? (
                <Badge variant="outline" className="text-primary">
                  {t("onTrack")}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-destructive">
                  {t("negativeSavings")}
                </Badge>
              )}
            </CardAction>
          )}
        </CardHeader>
        <CardFooter>{t("currentMonth")}</CardFooter>
      </Card>
    </div>
  )
}
