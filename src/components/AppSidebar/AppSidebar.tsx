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
  DropdownMenuSeparator,
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
  customRenderElement?: React.ReactNode;
}

type Item = BaseItem &
  (
    | { url: string; onClick?: never; subItems?: never }
    | { url?: never; onClick: () => void; subItems?: never }
    | { url?: never; onClick?: never; subItems: SubItem[][] }
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
        [
          { title: "Undo", onClick: () => editor?.undo() },
          { title: "Redo", onClick: () => editor?.redo() },
        ],
        [
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
        ],
        [
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
        ],
        // TODO: edit link (if shape is selected)
        // TODO: flatten (if shape is selected) <- I believe this means convert to image w/ some padding
        // TODO: Toggle locked (if shape is selected)
        [
          {
            title: "Unlock All",
            onClick: () => {
              editor &&
                Array.from(
                  editor.getPageShapeIds(editor.getPages()[0]),
                ).forEach((s) => {
                  if (editor.getShape(s)?.isLocked) {
                    editor.toggleLock([s]);
                  }
                });
            },
          },
        ],
        [
          {
            title: "Select All",
            onClick: () => {
              editor?.selectAll();
            },
          },
        ],
      ],
    },
    {
      title: "View",
      icon: Telescope,
      subItems: [
        [
          {
            title: "Zoom In",
            onClick: () =>
              editor?.zoomIn(editor.getViewportScreenCenter(), {
                animation: { duration: 200 },
              }),
          },
          {
            title: "Zoom Out",
            onClick: () =>
              editor?.zoomOut(editor.getViewportScreenCenter(), {
                animation: { duration: 200 },
              }),
          },
          {
            title: "Zoom to Fit",
            onClick: () => editor?.zoomToFit({ animation: { duration: 200 } }),
          },
        ],
      ],
    },
    {
      title: "Preferences",
      icon: Settings2,
      subItems: [
        [
          {
            title: "Always Snap",
            onClick: () => {
              editor?.user.updateUserPreferences({
                isSnapMode: !editor.user.getIsSnapMode(),
              });
            },
          },
          {
            title: "Tool Lock",
            onClick: () => {
              editor?.updateInstanceState({
                isToolLocked: !editor.getInstanceState().isToolLocked,
              });
            },
          },
          {
            title: "Show Grid",
            onClick: () => {
              editor?.updateInstanceState({
                isGridMode: !editor.getInstanceState().isGridMode,
              });
            },
          },
          {
            title: "Select on Wrap",
            onClick: () => {
              editor?.user.updateUserPreferences({
                isWrapMode: !editor.user.getIsWrapMode(),
              });
            },
          },
          {
            title: "Focus Mode",
            onClick: () => {
              editor?.updateInstanceState({
                isFocusMode: !editor.getInstanceState().isFocusMode,
              });
            },
          },
          {
            title: "Edge Scrolling",
            onClick: () => {
              editor?.user.updateUserPreferences({
                edgeScrollSpeed: editor.user.getEdgeScrollSpeed() === 0 ? 1 : 0,
              });
            },
          },
          {
            title: "Reduce Motion",
            onClick: () => {
              editor?.user.updateUserPreferences({
                animationSpeed: editor.user.getAnimationSpeed() === 0 ? 1 : 0,
              });
            },
          },
          {
            title: "Dynamic Size",
            onClick: () => {
              editor?.user.updateUserPreferences({
                isDynamicSizeMode: !editor.user.getIsDynamicResizeMode(),
              });
            },
          },
          {
            title: "Paste at Cursor",
            onClick: () => {
              editor?.user.updateUserPreferences({
                isPasteAtCursorMode: !editor.user.getIsPasteAtCursorMode(),
              });
            },
          },
          {
            title: "Debug Mode",
            onClick: () => {
              editor?.updateInstanceState({
                isFocusMode: !editor.getInstanceState().isFocusMode,
              });
            },
          },
        ],
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
        // TODO: build pretty dialog/modal that opens on this click
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
                          {item.subItems.map((group, groupIndex) => (
                            <>
                              {groupIndex > 0 && (
                                <DropdownMenuSeparator
                                  key={`separator${groupIndex}`}
                                />
                              )}
                              {group.map((subItem) => (
                                <DropdownMenuItem
                                  key={subItem.title}
                                  onClick={subItem.onClick}
                                  className="hover:cursor-pointer"
                                >
                                  {subItem.title}
                                  {/* TODO: maybe add little icons showing kbd shortcuts */}
                                </DropdownMenuItem>
                              ))}
                            </>
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
