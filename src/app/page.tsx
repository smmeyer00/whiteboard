import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

async function getDocuments(userId?: string) {
  if (!userId) {
    return [];
  }
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

// TODO: add new document handling (pop a modal that asks for title and description, then redirect to new doc)
export default async function HomePage() {
  const { userId } = await auth();

  const documents = await getDocuments(userId ?? undefined);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-2">
            Manage and access your whiteboards
          </p>
        </div>
        <Button asChild>
          <Link href="/d/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Document
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead className="w-[400px]">Description</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Collaborators</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-muted-foreground"
                >
                  No documents yet. Create your first one!
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    <Link href={`/d/${doc.id}`} className="hover:underline">
                      {doc.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {doc.description || "No description"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(doc.updatedAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>{doc.collaborators.length}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/d/${doc.id}`}>Open</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
