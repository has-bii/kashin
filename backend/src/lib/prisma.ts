import { ENV } from "../config/env"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: ENV.DB.url })
export const prisma = new PrismaClient({ adapter })
