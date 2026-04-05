"use client"

import { useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, SearchIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import type { DateRange } from "react-day-picker"

import { useTransactionFilters } from "@/features/transaction/hooks/use-transaction-filters"
import { getCategoriesQueryOptions } from "@/features/category/api/get-categories.query"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"

const TYPE_OPTIONS = [
  { labelKey: "all", value: "all" as const },
  { labelKey: "expenseFilter", value: "expense" as const },
  { labelKey: "incomeFilter", value: "income" as const },
] as const

export function TransactionFilterBar() {
  const { filters, setFilters, resolvedDateFrom, resolvedDateTo } = useTransactionFilters()
  const t = useTranslations("transaction.filters")

  // Search debounce
  const [searchInput, setSearchInput] = useState(filters.search ?? "")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setSearchInput(filters.search ?? "")
  }, [filters.search])

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setFilters({ search: value || null, page: 1 })
    }, 300)
  }

  // Categories for dropdown
  const { data: categories } = useQuery(getCategoriesQueryOptions({ type: null }))

  // Date range state derived from URL
  const dateRange: DateRange = {
    from: new Date(resolvedDateFrom),
    to: new Date(resolvedDateTo),
  }

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setFilters({
      dateFrom: range?.from ? format(range.from, "yyyy-MM-dd") : null,
      dateTo: range?.to ? format(range.to, "yyyy-MM-dd") : null,
      page: 1,
    })
  }

  const dateLabel = (() => {
    const from = new Date(resolvedDateFrom)
    const to = new Date(resolvedDateTo)
    return `${format(from, "MMM d, yyyy")} – ${format(to, "MMM d, yyyy")}`
  })()

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Type toggle */}
      <div className="flex items-center rounded-full border bg-input/50 p-1">
        {TYPE_OPTIONS.map((opt) => {
          const isActive =
            opt.value === "all" ? filters.type === null : filters.type === opt.value
          return (
            <button
              key={opt.value}
              onClick={() =>
                setFilters({
                  type: opt.value === "all" ? null : (opt.value as "expense" | "income"),
                  page: 1,
                })
              }
              className={cn(
                "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t(opt.labelKey)}
            </button>
          )
        })}
      </div>

      {/* Category dropdown */}
      <Select
        value={filters.categoryId ?? "all"}
        onValueChange={(value) =>
          setFilters({ categoryId: value === "all" ? null : value, page: 1 })
        }
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories?.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              <span className="mr-1">{cat.icon}</span>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date range picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-64 justify-start gap-2 font-normal">
            <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate text-sm">{dateLabel}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleDateRangeSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Search input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search transactions..."
          className="w-56 pl-9"
        />
      </div>
    </div>
  )
}
