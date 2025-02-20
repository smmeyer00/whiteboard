import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    clerkId: "fake1",
  },
  {
    clerkId: "fake2",
  },
  {
    clerkId: "user_2t7DkWZTvNsymf0ZSMF3zYv8s3W",
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
