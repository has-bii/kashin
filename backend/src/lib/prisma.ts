import { PrismaClient } from "../generated/prisma/client"
import { PrismaTiDBCloud } from "@tidbcloud/prisma-adapter"

const adapter = new PrismaTiDBCloud({
  url: process.env.DATABASE_URL,
})

export const prisma = new PrismaClient({ adapter })
