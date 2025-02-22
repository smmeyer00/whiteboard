"use client";

import { Pencil } from "lucide-react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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
import { useWhiteboard } from "@/hooks/whiteboard";

interface AppSidebarHeaderProps {
  docId: number;
}

// TODO: convert edit dialog to shadcn <Form /> for accessbility and best practices
export const AppSidebarHeader: FC<AppSidebarHeaderProps> = ({
  docId,
}): React.ReactNode => {
  console.log("HEADER with docId ", docId);

  const { data, isLoading } = useWhiteboard(docId);

  const [diagramName, setDiagramName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (data) {
      setDiagramName(data.name);
      setDescription(data.description ?? "");
    }
  }, [data]);

  return (
    <SidebarHeader>
      <Dialog>
        <SidebarMenu>
          <SidebarMenuItem>
            {/**
             * This will hold doc title
             *
             * Show at max => 24 chars + ...
             *
             * */}
            <DialogTrigger asChild>
              <SidebarMenuButton>
                {/* IAM Sys Design adsf asdf... */}
                {isLoading && "Loading..."}
                {!isLoading && diagramName.substring(0, 24)}
                {!isLoading && diagramName.length > 24 && "..."}
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
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarHeader>
  );
};
