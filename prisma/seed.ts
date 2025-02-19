import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const regencyIds = new Set<number>();
  while (regencyIds.size < 15) {
    const randomRegencyId =
      Math.floor(Math.random() * (9606 - 1101 + 1)) + 1101;
    regencyIds.add(randomRegencyId);
  }

  const usersData = Array.from(regencyIds).map((regencyId, index) => ({
    email: `user${index + 1}@example.com`,
    role: UserRole.USER, // Assuming UserRole is an enum with "USER" as a valid value
    fullName: `User ${index + 1}`,
    isVerified: true,
    isDeleted: false,
  }));

  for (const user of usersData) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log("Users seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
