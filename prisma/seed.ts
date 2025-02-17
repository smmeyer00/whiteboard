import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    firstName: "Alice In Chains",
    email: "alice@prisma.io",
    posts: {
      create: [
        {
          title: "Join the Prisma Discord",
          content: "https://pris.ly/discord",
          published: true,
        },
        {
          title: "Prisma on YouTube",
          content: "https://pris.ly/youtube",
        },
      ],
    },
    clerkId: "fake1",
  },
  {
    firstName: "Bob",
    lastName: "Marley",
    email: "bob@prisma.io",
    posts: {
      create: [
        {
          title: "Follow Prisma on Twitter",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
      ],
    },
    clerkId: "fake2",
  },
  {
    firstName: "Steven",
    lastName: "Meyer",
    email: "smmeyer00@gmail.com",
    posts: {
      create: [
        {
          title: "Steven's first post",
          content: "Hello World! This is my first post!",
          published: true,
        },
      ],
    },
    clerkId: "user_2t7DkWZTvNsymf0ZSMF3zYv8s3W",
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
