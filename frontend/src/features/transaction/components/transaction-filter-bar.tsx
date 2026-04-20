"use client"

import { SelectTab, SelectTabItem } from "@/components/select-tab"
import { Calendar } from "@/components/ui/calendar"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCategoriesQueryOptions } from "@/features/category/api/get-categories.api"
import { useTransactionFilters } from "@/features/transaction/hooks/use-transaction-filters"
import { TransactionType } from "@/types/enums"
import { formatDate } from "@/utils/format-date"
import { useSuspenseQuery } from "@tanstack/react-query"
import { isSameMonth, isSameYear } from "date-fns"
import { CalendarIcon, SearchIcon } from "lucide-react"
import React from "react"
import type { DateRange } from "react-day-picker"
import { useDebounce } from "use-debounce"

const TYPE_OPTIONS = [
  { label: "All", value: "all" as const },
  { label: "Expense", value: "expense" as const },
  { label: "Income", value: "income" as const },
] as const

export default function TransactionFilterBar() {
  const { filters, setFilters } = useTransactionFilters()

  // Categories for dropdown
  const { data: categories } = useSuspenseQuery(getCategoriesQueryOptions({ type: null }))

  // Search local states with debounce
  const [search, setSearch] = React.useState("")
  const [debouncedSearch] = useDebounce(search, 500)

  // set search filter with debounced value
  React.useEffect(() => {
    setFilters({
      search: debouncedSearch,
    })
  }, [debouncedSearch, setFilters])

  // Date range state derived from URL
  const dateRange: DateRange = {
    from: filters.dateFrom,
    to: filters.dateTo,
  }

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setFilters({
      dateFrom: range?.from,
      dateTo: range?.to,
      page: 1,
    })
  }

  const dateLabel = React.useMemo(() => {
    const from = filters.dateFrom
    const to = filters.dateTo

    if (isSameMonth(from, to)) return `${formatDate(from, "d")} - ${formatDate(to, "d MMM y")}`

    if (isSameYear(from, to)) return `${formatDate(from, "d MMM y")} - ${formatDate(to, "d MMM y")}`

    return `${formatDate(from, "PP")} – ${formatDate(to, "PP")}`
  }, [filters.dateFrom, filters.dateTo])

  const filteredCategory = React.useMemo(() => {
    return categories.filter((category) => (!filters.type ? true : filters.type === category.type))
  }, [categories, filters.type])

  return (
    <div className="flex flex-wrap gap-4">
      {/* Type */}
      <SelectTab
        className="grow basis-72"
        value={!filters.type ? "all" : filters.type}
        onChangeValue={(value) =>
          setFilters({
            page: 1,
            type: value === "all" ? null : (value as TransactionType),
          })
        }
      >
        {TYPE_OPTIONS.map((opt) => (
          <SelectTabItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectTabItem>
        ))}
      </SelectTab>

      {/* Category dropdown */}
      <Select
        value={filters.categoryId ?? "all"}
        onValueChange={(value) =>
          setFilters({ categoryId: value === "all" ? null : value, page: 1 })
        }
      >
        <SelectTrigger className="h-13! grow basis-72" size="xl">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {filteredCategory.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date range picker */}
      <Popover>
        <PopoverTrigger asChild>
          <div
            role="button"
            className="bg-input/50 flex h-13 grow basis-72 items-center justify-between rounded-3xl px-4"
          >
            <div>
              <span className="text-muted-foreground block text-xs leading-4 font-medium">
                PERIOD
              </span>
              <span className="block truncate text-sm leading-4 font-bold whitespace-nowrap">
                {dateLabel}
              </span>
            </div>
            <CalendarIcon className="text-primary size-4" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleDateRangeSelect}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>

      {/* Search input */}
      <InputGroup className="h-13 grow basis-72">
        <InputGroupInput
          placeholder="Search..."
          defaultValue={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
