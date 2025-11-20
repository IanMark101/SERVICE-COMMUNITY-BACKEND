import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Plumbing" },
    { name: "Electrical Repair" },
    { name: "House Cleaning" },
    { name: "Tutoring" },
    { name: "Gardening" },
  ];

  for (const category of categories) {
    await prisma.serviceCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log("✅ Service categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
