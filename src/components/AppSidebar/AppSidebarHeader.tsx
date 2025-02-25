"use client";

import { Pencil } from "lucide-react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import React, { FC, useEffect, useState } from "react";
import {
  useUpdateWhiteboardMutation,
  useWhiteboardQuery,
} from "@/hooks/whiteboard";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";

interface AppSidebarHeaderProps {
  docId: number;
}

// TODO: convert edit dialog to shadcn <Form /> for accessbility and best practices
export const AppSidebarHeader: FC<AppSidebarHeaderProps> = ({
  docId,
}): React.ReactNode => {
  console.log("HEADER with docId ", docId);

  const { data, isLoading } = useWhiteboardQuery(docId);
  const { mutate, isSuccess, isError } = useUpdateWhiteboardMutation();

  const [diagramName, setDiagramName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (data) {
      setDiagramName(data.name);
      setDescription(data.description ?? "");
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      toast("Success", {
        description: "Document details updated successfully",
      });
      setDialogOpen(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error("Error", {
        description: "Failed to update document details",
      });
    }
  }, [isError]);

  const dialogSubmitHandler = () => {
    if (!data || !diagramName.trim()) return;

    mutate({
      id: docId,
      data: {
        name: diagramName.trim(),
        description: description.trim() || null, // Convert empty string to null
      },
    });
  };

  return (
    <SidebarHeader>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <SidebarMenu>
          <SidebarMenuItem>
            <DialogTrigger disabled={isLoading} asChild>
              <SidebarMenuButton>
                {isLoading || !data ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  ellipseString(data.name, 24)
                )}
                <Pencil className="ml-auto" />
              </SidebarMenuButton>
            </DialogTrigger>
          </SidebarMenuItem>
        </SidebarMenu>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Document Title</Label>
              <Input
                id="name"
                placeholder="My First Diagram"
                value={diagramName}
                onChange={(e) => setDiagramName(e.target.value)}
                maxLength={128}
              />
              <p className="text-sm text-muted-foreground text-right">
                {diagramName.length.toString()}/128
              </p>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description of your document..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={256}
                className="resize-none min-h-[140px]"
              />
              <p className="text-sm text-muted-foreground text-right">
                {description.length.toString()}/256
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={
                isLoading ||
                (data?.name === diagramName && data.description === description)
              }
              onClick={dialogSubmitHandler}
              type="submit"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarHeader>
  );
};

const ellipseString = (str: string, max: number) => {
  return str.length < max ? str : str.substring(0, max) + "...";
};
