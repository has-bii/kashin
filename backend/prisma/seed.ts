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
