import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const allUsers = await prisma.user.findMany();

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center space-y-8">
      <h1 className="text-4xl font-bold text-center text-foreground">
        {user ? `Hello, ${user.fullName}` : "Hello, World!"}
      </h1>

      <h2 className="text-2xl font-bold text-center text-white">
        {user ? `Hello, ${user.id}` : "<user_not_loaded>"}
      </h2>

      {allUsers.map((user) => (
        <div key={user.id} className="text-foreground">
          {user.firstName} {user.lastName}
        </div>
      ))}
    </div>
  );
}
