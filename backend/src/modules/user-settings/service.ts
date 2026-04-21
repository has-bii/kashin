import { prisma } from "../../lib/prisma"
import type { UpdateInput } from "./dto"

export abstract class UserSettingsService {
  static async get(userId: string) {
    return prisma.userSettings.upsert({
      where: { userId },
      update: {},
      create: { userId },
    })
  }

  static async update(userId: string, data: UpdateInput) {
    return prisma.userSettings.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    })
  }
}
