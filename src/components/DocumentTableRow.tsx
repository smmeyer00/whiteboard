"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

type DocumentTableRowProps = {
  id: number;
  name: string;
  description: string | null;
  updatedAt: Date;
};

export function DocumentTableRow({
  id,
  name,
  description,
  updatedAt,
}: DocumentTableRowProps) {
  const router = useRouter();

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => router.push(`/d/${id}`)}
    >
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell className="hidden sm:table-cell text-muted-foreground">
        {description || "No description"}
      </TableCell>
      <TableCell className="text-muted-foreground whitespace-nowrap">
        {formatDistanceToNow(new Date(updatedAt), {
          addSuffix: true,
        })}
      </TableCell>
    </TableRow>
  );
}
