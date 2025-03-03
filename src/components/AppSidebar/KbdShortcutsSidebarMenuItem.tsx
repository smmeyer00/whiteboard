import { Keyboard } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import { Separator } from "../ui/separator";

export default function KbdShortcutsSidebarMenuItem(): React.ReactNode {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <SidebarMenuItem>
        <DialogTrigger asChild>
          <SidebarMenuButton>
            <Keyboard />
            <span>{"Keyboard Shortcuts"}</span>
          </SidebarMenuButton>
        </DialogTrigger>
      </SidebarMenuItem>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle className="text-center">Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex flex-row gap-4 py-2">
          <div className="flex-grow basis-0 space-y-4 mx-2">
            <ShortcutGroupHeader>Tools</ShortcutGroupHeader>
            <Shortcut label={"Toggle tool lock"} keys={"Q"} />
            <Shortcut label={"Upload media"} keys={"Ctrl U"} />
            <Shortcut label={"Select"} keys={"V"} />
            <Shortcut label={"Draw"} keys={"D"} />
            <Shortcut label={"Eraser"} keys={"E"} />
            <Shortcut label={"Hand"} keys={"H"} />
            <Shortcut label={"Rectangle"} keys={"R"} />
            <Shortcut label={"Ellipse"} keys={"O"} />
            <Shortcut label={"Arrow"} keys={"A"} />
            <Shortcut label={"Line"} keys={"L"} />
            <Shortcut label={"Text"} keys={"T"} />
            <Shortcut label={"Frame"} keys={"F"} />
            <Shortcut label={"Note"} keys={"N"} />
            <Shortcut label={"Laser"} keys={"K"} />
            <Shortcut label={"Pointer down"} keys={","} />
          </div>
          <Separator orientation="vertical" />
          <div className="flex-grow basis-0 space-y-4 mx-2">
            <ShortcutGroupHeader>Preferences</ShortcutGroupHeader>
            <Shortcut label={"Toggle dark mode"} keys={"Ctrl /"} />
            <Shortcut label={"Toggle focus mode"} keys={"Ctrl ."} />
            <Shortcut label={"Toggle grid"} keys={"Ctrl '"} />

            <ShortcutGroupHeader>Edit</ShortcutGroupHeader>
            <Shortcut label={"Undo"} keys={"Ctrl Z"} />
            <Shortcut label={"Redo"} keys={"Ctrl ⇧ Z"} />
            <Shortcut label={"Cut"} keys={"Ctrl X"} />
            <Shortcut label={"Copy"} keys={"Ctrl C"} />
            <Shortcut label={"Paste"} keys={"Ctrl V"} />
            <Shortcut label={"Select all"} keys={"Ctrl A"} />
            <Shortcut label={"Delete"} keys={"⌫"} />
            <Shortcut label={"Duplicate"} keys={"Ctrl D"} />

            <ShortcutGroupHeader>View</ShortcutGroupHeader>
            <Shortcut label={"Zoom in"} keys={"Ctrl ="} />
            <Shortcut label={"Zoom out"} keys={"Ctrl -"} />
            <Shortcut label={"Zoom to 100%"} keys={"⇧ 0"} />
            <Shortcut label={"Zoom to fit"} keys={"⇧ 1"} />
            <Shortcut label={"Zoom to selection"} keys={"⇧ 2"} />
          </div>
          <Separator orientation="vertical" />
          <div className="flex-grow basis-0 space-y-4 mx-2">
            <ShortcutGroupHeader>Transform</ShortcutGroupHeader>
            <Shortcut label={"Bring to front"} keys={"]"} />
            <Shortcut label={"Bring forward"} keys={"Alt ]"} />
            <Shortcut label={"Send backward"} keys={"Alt ["} />
            <Shortcut label={"Send to back"} keys={"["} />
            <Shortcut label={"Group"} keys={"Ctrl G"} />
            <Shortcut label={"Ungroup"} keys={"Ctrl ⇧ G"} />
            <Shortcut label={"Flip horizontally"} keys={"⇧ H"} />
            <Shortcut label={"Flip vertically"} keys={"⇧ V"} />
            <Shortcut label={"Align top"} keys={"Alt W"} />
            <Shortcut label={"Align vertically"} keys={"Alt V"} />
            <Shortcut label={"Align bottom"} keys={"Alt S"} />
            <Shortcut label={"Align left"} keys={"Alt A"} />
            <Shortcut label={"Align horizontally"} keys={"Alt H"} />
            <Shortcut label={"Align right"} keys={"Alt D"} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShortcutGroupHeader({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <p className="leading-7 [&:not(:first-child)]:pt-6 text-muted-foreground text-sm font-medium">
      {children}
    </p>
  );
}

function Shortcut({
  label,
  keys,
}: {
  label: string;
  keys: string;
}): React.ReactNode {
  return (
    <div className="flex justify-between items-center text-xs font-medium leading-none">
      <p>{label}</p>
      <p>{keys}</p>
    </div>
  );
}
