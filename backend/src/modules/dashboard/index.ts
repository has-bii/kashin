import { authMacro } from "../../macros/auth.macro"
import { DashboardService } from "./service"
import { summaryQuery, categoryBreakdownQuery, trendsQuery, recentQuery } from "./dto"
import Elysia from "elysia"

export const dashboardController = new Elysia({ prefix: "/dashboard" })
  .use(authMacro)
  .get(
    "/summary",
    async ({ user, query }) => DashboardService.summary(user.id, query),
    { auth: true, query: summaryQuery },
  )
  .get(
    "/category-breakdown",
    async ({ user, query }) => DashboardService.categoryBreakdown(user.id, query),
    { auth: true, query: categoryBreakdownQuery },
  )
  .get(
    "/trends",
    async ({ user, query }) => DashboardService.trends(user.id, query.months ?? 6),
    { auth: true, query: trendsQuery },
  )
  .get(
    "/recent",
    async ({ user, query }) => DashboardService.recent(user.id, query.limit ?? 5),
    { auth: true, query: recentQuery },
  )
