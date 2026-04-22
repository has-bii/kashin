import { createError } from "../../global/error"
import { prisma } from "../../lib/prisma"
import { status } from "elysia"
import type { CreateInput, UpdateInput, GetAllQuery } from "./dto"

export abstract class CategoryService {
  static async getAll(userId: string, type?: GetAllQuery["type"]) {
    return prisma.category.findMany({
      where: { userId, ...(type ? { type } : undefined) },
      orderBy: { createdAt: "desc" },
    })
  }

  static async getById(userId: string, id: string) {
    const category = await prisma.category.findUnique({ where: { id, userId } })
    if (!category) createError("not_found", "Category not found")
    return category!
  }

  static async create(userId: string, input: CreateInput) {
    const isExist = await prisma.category.findUnique({
      where: { name_userId: { name: input.name, userId } },
    })
    if (isExist) createError("conflict", "Category with the same name already exists")

    const data = await prisma.category.create({ data: { ...input, userId } })
    return status(201, data)
  }

  static async update(userId: string, id: string, input: UpdateInput) {
    if (input.name) {
      const isExist = await prisma.category.findUnique({
        where: { name_userId: { name: input.name, userId }, NOT: { id } },
      })
      if (isExist) createError("conflict", "Category with the same name already exists")
    }

    return prisma.category.update({ where: { id, userId }, data: input })
  }

  static async delete(userId: string, id: string) {
    const isExist = await prisma.category.findUnique({ where: { id, userId } })
    if (!isExist) createError("not_found", "Category not found")

    return prisma.category.delete({ where: { id, userId } })
  }
}
