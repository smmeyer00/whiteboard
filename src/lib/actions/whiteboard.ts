"use server";

import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export async function getWhiteboard(id: number) {
  console.log("getWhiteboard server action with id ", id);
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

// TODO fix this
// export async function updateWhiteboard(id: number, data: any ) {
//   // Your prisma query here
//   const whiteboard = await prisma.whiteboard.update({
//     where: { id },
//     data,
//   });
//   return whiteboard;
// }
