import { t } from "elysia"
import { prisma } from "../../lib/prisma"

export const userSettingsUpdateBody = t.Object({
  filterEmailsByBank: t.Boolean(),
})

type UserSettingsUpdateInput = (typeof userSettingsUpdateBody)["static"]

export abstract class UserSettingsService {
  static async get(userId: string) {
    return prisma.userSettings.upsert({
      where: { userId },
      update: {},
      create: { userId, filterEmailsByBank: false },
    })
  }

  static async update(userId: string, data: UserSettingsUpdateInput) {
    return prisma.userSettings.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    })
  }
}
