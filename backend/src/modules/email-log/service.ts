import { Prisma } from "../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { getAllQuery } from "./query"

type GetAllQuery = (typeof getAllQuery)["static"]

export abstract class EmailLogService {
  /* ------------------------------ API Endpoints ----------------------------- */
  static async getAll(userId: string, query: GetAllQuery) {
    const { page = 1, limit = 20, dateFrom, dateTo } = query
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { userId }
    if (dateFrom || dateTo) {
      where.transactionDate = {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(dateTo) } : {}),
      }
    }

    const [data, total] = await prisma.$transaction([
      prisma.emailLog.findMany({
        where,
        orderBy: { receivedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.emailLog.count({ where }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  static async findByid(id: string) {
    return prisma.emailLog.findUnique({
      where: { id: BigInt(id) },
    })
  }

  static async update(id: string, data: Prisma.EmailLogUpdateInput) {
    return prisma.emailLog.update({
      where: { id: BigInt(id) },
      data,
    })
  }

  /* --------------------------------- Private -------------------------------- */
  static async insert(input: Prisma.EmailLogCreateInput) {
    return prisma.emailLog.create({ data: input })
  }
}
