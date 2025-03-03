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
  SquarePlus,
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
import { FC, ForwardRefExoticComponent, Fragment, RefAttributes } from "react";
import { useTldraw } from "@/contexts/TldrawContext";
import { tldrawExport } from "@/lib/utils";
import {
  copyAs,
  useActions,
  useDefaultHelpers,
  useMenuClipboardEvents,
} from "tldraw";
import KbdShortcutsSidebarMenuItem from "./KbdShortcutsSidebarMenuItem";
import ExportSidebarMenuItem from "./ExportSidebarMenuItem";

interface SubItem {
  title: string;
  onClick: () => void;
}

interface BaseItem {
  title: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  customRenderElement?: () => React.ReactNode;
}

type Item = BaseItem &
  (
    | { url: string; onClick?: never; subItemGroups?: never }
    | { url?: never; onClick: () => void; subItemGroups?: never }
    | { url?: never; onClick?: never; subItemGroups: SubItem[][] }
  );

interface AppSidebarProps {
  docId: number;
}

// TODO: refactor to just use the built-in actions (available thru my custom context) for everything
export const AppSidebar: FC<AppSidebarProps> = ({ docId }): React.ReactNode => {
  const { editor, menuClipBoardEvents, actions } = useTldraw();

  const docItems: Item[] = [
    {
      title: "Edit",
      icon: PencilRuler,
      subItemGroups: [
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
        // TODO: maybe re-add this to maintain parity w/ tldraw actions menu, and abstract the export dialog to be used here as well
        // [
        //   {
        //     title: "Export",
        //     onClick: () => {
        //       tldrawExport(editor, "o.png", {
        //         format: "png",
        //         quality: 1,
        //         scale: 1,
        //         background: true,
        //       });
        //     },
        //   },
        // ],

        // TODO: edit link (if shape is selected)
        // TODO: flatten (if shape is selected) <- I believe this means convert to image w/ some padding
        //       https://github.com/tldraw/tldraw/blob/main/packages/tldraw/src/lib/ui/context/actions.tsx#L1382

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
      subItemGroups: [
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
    // TODO: Add Insert w/ sub-items Embed and Media (just trigger the built in dialog for each)
    {
      title: "Insert",
      icon: SquarePlus,
      subItemGroups: [
        [
          {
            title: "Embed",
            onClick: () => {
              actions && actions["insert-embed"]?.onSelect("unknown");
            },
          },
          {
            title: "Media",
            onClick: () => {
              actions && actions["insert-media"]?.onSelect("unknown");
            },
          },
        ],
      ],
    },
    {
      title: "Preferences",
      icon: Settings2,
      subItemGroups: [
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
      customRenderElement: ExportSidebarMenuItem,
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
      customRenderElement: KbdShortcutsSidebarMenuItem,
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
                if (item.customRenderElement) {
                  return <item.customRenderElement key={item.title} />;
                } else if (item.subItemGroups) {
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
                          {item.subItemGroups.map((group, groupIndex) => (
                            <Fragment key={`group-${groupIndex}`}>
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
                            </Fragment>
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
