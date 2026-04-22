import { PrismaClient } from "../src/generated/prisma/client"
import banks from "./banks.json"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({
  adapter,
})

async function main() {
  // seed banks
  const data = await prisma.bank.createManyAndReturn({
    skipDuplicates: true,
    data: banks,
  })

  console.log(`${data.length} banks created`)

  // seed free plan
  const freePlan = await prisma.plan.upsert({
    where: { code: "free" },
    update: {},
    create: {
      code: "free",
      name: "Free",
      dailyAiLimit: 5,
      priceCents: 0,
    },
  })

  console.log(`free plan: ${freePlan.id}`)

  // backfill subscriptions for users without one
  const users = await prisma.user.findMany({
    select: { id: true },
    where: { subscription: null },
  })

  if (users.length > 0) {
    const now = new Date()
    const farFuture = new Date("2099-12-31")
    await prisma.subscription.createMany({
      data: users.map((u) => ({
        userId: u.id,
        planId: freePlan.id,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: farFuture,
      })),
    })
    console.log(`${users.length} subscriptions backfilled`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
