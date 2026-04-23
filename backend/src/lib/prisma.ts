import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { ENV } from "../config/env"

const adapter = new PrismaPg({ connectionString: ENV.DB.url })
export const prisma = new PrismaClient({ adapter })
