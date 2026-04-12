import { TransactionType } from "../../generated/prisma/enums"
import {
  CategoryPlainInputCreate,
  CategoryPlainInputUpdate,
} from "../../generated/prismabox/Category"
import { Conflict } from "../../global/error"
import { prisma } from "../../lib/prisma"
import { NotFoundError, status } from "elysia"

export abstract class CategoryService {
  static async getAll(userId: string, type?: TransactionType) {
    return prisma.category.findMany({
      where: { userId, ...(type ? { type } : undefined) },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  static async getById(userId: string, id: string) {
    return prisma.category.findUnique({
      where: {
        id,
        userId,
      },
    })
  }

  static async create(userId: string, input: (typeof CategoryPlainInputCreate)["static"]) {
    // Check unique name
    const isExist = await prisma.category.findUnique({
      where: {
        name_userId: {
          name: input.name,
          userId,
        },
      },
    })
    if (isExist) throw new Conflict("Kategori dengan nama yang sama sudah ada")

    const data = await prisma.category.create({
      data: { ...input, userId },
    })

    return status(201, data)
  }

  static async update(
    userId: string,
    id: string,
    input: (typeof CategoryPlainInputUpdate)["static"],
  ) {
    // Check unique name
    if (input.name) {
      const isExist = await prisma.category.findUnique({
        where: {
          name_userId: {
            name: input.name,
            userId,
          },
          NOT: {
            id,
          },
        },
      })

      if (isExist) throw new Conflict("Kategori dengan nama yang sama sudah ada")
    }

    return prisma.category.update({
      where: { id, userId },
      data: input,
    })
  }

  static async delete(userId: string, id: string) {
    // Check if exist
    const isExist = await prisma.category.findUnique({
      where: { id, userId },
    })

    if (!isExist) throw new NotFoundError("Kategori tidak ditemukan")

    return prisma.category.delete({
      where: { id, userId },
    })
  }
}
