import { prisma } from "../../lib/prisma"

export abstract class BankService {
  static async getAll() {
    return prisma.bank.findMany({ orderBy: { name: "asc" } })
  }
}
