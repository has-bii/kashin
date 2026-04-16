import { prisma } from "../../lib/prisma"

export abstract class HealthService {
  static async check() {
    try {
      await prisma.$queryRaw`SELECT 1`
      return { status: "ok" as const, db: "connected" as const }
    } catch {
      return { status: "degraded" as const, db: "disconnected" as const }
    }
  }
}
