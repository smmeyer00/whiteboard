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
import Link from "next/link";
import { DocumentTableRow } from "@/components/DocumentTableRow";
import { getDocuments } from "@/lib/actions/whiteboard";

export default async function HomePage() {
  const documents = await getDocuments(); // TODO: use the hook instead, and create a mutation hook for creating new doc

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Documents
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and access your whiteboards
          </p>
        </div>
        {/** TODO: use onClick for some custom logic instead of link, might need client component for button */}
        <Button asChild className="w-full sm:w-auto">
          <Link href="/d/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Document
          </Link>
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px] sm:w-[300px]">Name</TableHead>
              <TableHead className="hidden sm:table-cell w-[400px]">
                Description
              </TableHead>
              <TableHead className="min-w-[120px]">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center h-24 text-muted-foreground"
                >
                  No documents yet. Create your first one!
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <DocumentTableRow
                  key={doc.id}
                  id={doc.id}
                  name={doc.name}
                  description={doc.description}
                  updatedAt={doc.updatedAt}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
