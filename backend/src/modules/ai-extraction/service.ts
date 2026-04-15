import { Prisma } from "../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

export abstract class AiExtractionService {
  /* ---------------------------- Public Functions ---------------------------- */
  static async insert(input: Prisma.AiExtractionCreateInput) {
    return prisma.aiExtraction.create({
      data: input,
    })
  }

  /* --------------------------------- Private -------------------------------- */
  static async update(id: string, input: Prisma.AiExtractionUpdateInput) {
    return prisma.aiExtraction.update({
      where: { id },
      data: input,
    })
  }
}
