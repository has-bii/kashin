import { HealthService } from "./service"
import Elysia from "elysia"

export const healthController = new Elysia({ prefix: "/health" }).get("/", async ({ set }) => {
  const health = await HealthService.check()

  if (health.db === "disconnected") set.status = 503

  return { ...health, timestamp: new Date().toISOString() }
})
