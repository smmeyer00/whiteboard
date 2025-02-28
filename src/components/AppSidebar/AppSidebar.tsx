"use client";

import {
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Cloud,
  Download,
  Home,
  Inbox,
  Keyboard,
  LucideProps,
  PencilRuler,
  Search,
  Settings,
  Settings2,
  Telescope,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AppSidebarHeader } from "./AppSidebarHeader";
import { AppSidebarFooter } from "./AppSidebarFooter";
import { FC, ForwardRefExoticComponent, RefAttributes } from "react";
import { useTldraw } from "@/contexts/TldrawContext";
import { tldrawExport } from "@/lib/utils";
import { copyAs, useActions, useMenuClipboardEvents } from "tldraw";

interface SubItem {
  title: string;
  onClick: () => void;
}

interface BaseItem {
  title: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

type Item = BaseItem &
  (
    | { url: string; onClick?: never; subItems?: never }
    | { url?: never; onClick: () => void; subItems?: never }
    | { url?: never; onClick?: never; subItems: SubItem[] }
  );

interface AppSidebarProps {
  docId: number;
}

export const AppSidebar: FC<AppSidebarProps> = ({ docId }): React.ReactNode => {
  const { editor, menuClipBoardEvents } = useTldraw();

  const docItems: Item[] = [
    {
      title: "Edit",
      icon: PencilRuler,
      subItems: [
        { title: "Undo", onClick: () => editor?.undo() },
        { title: "Redo", onClick: () => editor?.redo() },
        {
          title: "Cut",
          onClick: () => {
            // if (!editor) return; // TODO: disable if nothing selected
            menuClipBoardEvents?.cut("menu");
          },
        },
        {
          title: "Copy",
          onClick: () => {
            menuClipBoardEvents?.copy("menu");
          },
        },
        {
          title: "Paste",
          onClick: () => {
            navigator.clipboard.read().then((clipboardItems) => {
              menuClipBoardEvents?.paste(clipboardItems, "menu");
            });
          },
        },
        // TODO: duplicate (if something is selected)
        {
          title: "Delete",
          onClick: () => editor?.deleteShapes(editor?.getSelectedShapeIds()),
        },
        {
          title: "Export",
          onClick: () => {
            tldrawExport(editor, "o.png", {
              format: "png",
              quality: 1,
              scale: 1,
              background: true,
            });
          },
        },
        // TODO: edit link (if shape is selected)
        // TODO: flatten (if shape is selected) <- I believe this means convert to image w/ some padding
        // TODO: Toggle locked (if shape is selected)
        {
          title: "Unlock All",
          onClick: () => {
            editor &&
              Array.from(editor.getPageShapeIds(editor.getPages()[0])).forEach(
                (s) => {
                  if (editor.getShape(s)?.isLocked) {
                    editor.toggleLock([s]);
                  }
                },
              );
          },
        },
        {
          title: "Select All",
          onClick: () => {
            editor?.selectAll();
          },
        },
      ],
    },
    {
      title: "View",
      icon: Telescope,
      subItems: [
        { title: "Zoom In", onClick: () => console.log("Zoom in clicked") },
        { title: "Zoom Out", onClick: () => console.log("Zoom out clicked") },
        {
          title: "Zoom to Fit",
          onClick: () => console.log("Zoom to fit clicked"),
        },
      ],
    },
    {
      title: "Preferences",
      icon: Settings2,
      subItems: [
        {
          title: "Always Snap",
          onClick: () => console.log("Always snap clicked"),
        },
        { title: "Tool Lock", onClick: () => console.log("Tool lock clicked") },
        { title: "Show Grid", onClick: () => console.log("Show grid clicked") },
        {
          title: "Select on Wrap",
          onClick: () => console.log("Select on wrap clicked"),
        },
        {
          title: "Focus Mode",
          onClick: () => console.log("Focus mode clicked"),
        },
        {
          title: "Edge Scrolling",
          onClick: () => console.log("Edge scrolling clicked"),
        },
        {
          title: "Reduce Motion",
          onClick: () => console.log("Reduce motion clicked"),
        },
        {
          title: "Dynamic Size",
          onClick: () => console.log("Dynamic size clicked"),
        },
        {
          title: "Paste at Cursor",
          onClick: () => console.log("Paste at cursor clicked"),
        },
        {
          title: "Debug Mode",
          onClick: () => console.log("Debug mode clicked"),
        },
      ],
    },
    {
      title: "Export",
      icon: Download,
      onClick: () => {
        tldrawExport(editor, "o.png", {
          format: "png",
          quality: 1,
          scale: 1,
          background: true,
        });
      },
    },
    {
      title: "Keyboard Shortcuts",
      icon: Keyboard,
      onClick: () => {
        editor?.setCurrentTool("hand");
      },
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="floating">
      <AppSidebarHeader docId={docId} />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Document</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {docItems.map((item) => {
                if (item.subItems) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuButton>
                            <item.icon />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto" />
                          </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          {item.subItems.map((subItem) => (
                            <DropdownMenuItem
                              key={subItem.title}
                              onClick={subItem.onClick}
                              className="hover:cursor-pointer"
                            >
                              {subItem.title}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  );
                } else if (item.url) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                } else {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton onClick={item.onClick}>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Status</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* // TODO: Make this not a button, and maybe make text more minimal (small and gray, look at shadcn typography) */}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Cloud />
                  <span>Synced</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  );
};
