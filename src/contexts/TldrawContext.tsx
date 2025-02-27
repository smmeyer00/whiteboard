"use client";

import { Editor, TLUiEventSource, VecLike } from "tldraw";
import { createContext, useContext, useState } from "react";

interface MenuClipboardEventsType {
  copy: (source: TLUiEventSource) => Promise<void>;
  cut: (source: TLUiEventSource) => Promise<void>;
  paste: (
    data: ClipboardItem[] | DataTransfer,
    source: TLUiEventSource,
    point?: VecLike,
  ) => Promise<void>;
}

interface TldrawContextType {
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
  menuClipBoardEvents: MenuClipboardEventsType | null;
  setMenuClipBoardEvents: (
    menuClipBoardEvents: MenuClipboardEventsType | null,
  ) => void;
}

const TldrawContext = createContext<TldrawContextType | undefined>(undefined);

export function TldrawProvider({ children }: { children: React.ReactNode }) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [menuClipBoardEvents, setMenuClipBoardEvents] =
    useState<MenuClipboardEventsType | null>(null);

  return (
    <TldrawContext.Provider
      value={{ editor, setEditor, menuClipBoardEvents, setMenuClipBoardEvents }}
    >
      {children}
    </TldrawContext.Provider>
  );
}

export function useTldraw() {
  const context = useContext(TldrawContext);
  if (context === undefined) {
    throw new Error("useTldraw must be used within a TldrawProvider");
  }
  return context;
}
