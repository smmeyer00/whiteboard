import ClientTldraw from "@/components/ClientTldraw";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const clerkUser = await currentUser();
  const allUsers = await prisma.user.findMany();

  return (
    <div className="w-full h-screen flex flex-col items-center space-y-8">
      <h1 className="text-4xl font-bold text-center text-foreground">
        {clerkUser ? `Hello, ${clerkUser.fullName}` : "Hello, World!"}
      </h1>

      <h2 className="text-2xl font-bold text-center text-white">
        {clerkUser ? `Hello, ${clerkUser.id}` : "<user_not_loaded>"}
      </h2>

      <div className="flex-grow bg-red-300 w-full">
        {/* <Tldraw /> */}
        <ClientTldraw />
      </div>
    </div>
  );
}
