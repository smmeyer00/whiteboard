"use server";

import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export async function getWhiteboard(id: number) {
  // Your prisma query here
  const whiteboard = await prisma.whiteboard.findUnique({
    where: { id },
  });
  if (!whiteboard) {
    console.log("whiteboard not found");
    throw new Error("Whiteboard not found");
  }
  return whiteboard;
}

export async function updateWhiteboard(
  id: number,
  data: Prisma.WhiteboardUpdateInput,
) {
  // Your prisma query here
  const whiteboard = await prisma.whiteboard.update({
    where: { id },
    data,
  });
  return whiteboard;
}
