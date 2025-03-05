import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Setting up the database...")

  // Create admin user
  const adminPassword = await hash("admin123", 10)

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: adminPassword,
      name: "Admin User",
    },
  })

  console.log("Admin user created: admin@example.com (password: admin123)")
  console.log("Database setup complete!")
}

main()
  .catch((e) => {
    console.error("Error during setup:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

