"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export async function getWhiteboard(id: number) {
  const clerkUser = await currentUser();

  if (!clerkUser?.id) {
    throw new Error("Unauthorized");
  }

  const whiteboard = await prisma.whiteboard.findFirst({
    where: {
      id,
      owner: {
        clerkId: clerkUser.id,
      },
    },
  });

  if (!whiteboard) {
    // throw new Error("Whiteboard not found");
    redirect("/"); // For now just blanket redirect, assume doesn't exist

    // TODO: introduce granular error codes (ie whiteboard doesn't exist vs don't have access)
    // return {whiteboard, error} from this func where error is granular enum
    // handle accordingly on client (ie show request access dialog later, vs show doesn't exist, etc...)
  }

  return whiteboard;
}

export async function updateWhiteboard(
  id: number,
  data: Prisma.WhiteboardUpdateInput,
) {
  const clerkUser = await currentUser();

  if (!clerkUser?.id) {
    throw new Error("Unauthorized");
  }

  // Your prisma query here
  const whiteboard = await prisma.whiteboard.update({
    where: {
      id,
      owner: {
        clerkId: clerkUser.id,
      },
    },
    data,
  });
  return whiteboard;
}

export async function getDocuments() {
  const { userId } = await auth();
  if (!userId) return [];

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      whiteboards: {
        orderBy: { updatedAt: "desc" },
        include: { collaborators: true },
      },
    },
  });
  return user?.whiteboards ?? [];
}
export async function createDocument() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) throw new Error("User not found");

  const whiteboard = await prisma.whiteboard.create({
    data: {
      name: "Untitled",
      ownerId: user.id,
      content: {}, // Add required content field
    },
  });

  return whiteboard;
}
