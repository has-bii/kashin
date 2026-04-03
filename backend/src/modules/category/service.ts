import { prisma } from "../../lib/prisma"
import { CreateCategoryDto, UpdateCategoryDto } from "./model"
import { TransactionType } from "../../generated/prisma/client"

export const categoryService = {
  async list(userId: string, type?: TransactionType) {
    return prisma.category.findMany({
      where: { userId, ...(type ? { type } : {}) },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    })
  },

  async getById(id: string, userId: string) {
    const category = await prisma.category.findFirst({ where: { id, userId } })

    if (!category) throw { status: 404, message: "Category not found" }

    return category
  },

  async create(userId: string, data: CreateCategoryDto) {
    return prisma.category.create({
      data: { ...data, userId },
    })
  },

  async update(id: string, userId: string, data: UpdateCategoryDto) {
    const existing = await prisma.category.findFirst({ where: { id } })

    if (!existing) throw { status: 404, message: "Category not found" }
    if (existing.userId !== userId) throw { status: 403, message: "Forbidden" }

    return prisma.category.update({ where: { id }, data })
  },

  async delete(id: string, userId: string) {
    const existing = await prisma.category.findFirst({ where: { id } })

    if (!existing) throw { status: 404, message: "Category not found" }
    if (existing.userId !== userId) throw { status: 403, message: "Forbidden" }

    return prisma.category.delete({ where: { id } })
  },
}
