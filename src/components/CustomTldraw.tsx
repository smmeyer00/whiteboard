"use client";

import {
  Tldraw,
  setUserPreferences,
  useActions,
  useDefaultHelpers,
  useMenuClipboardEvents,
} from "tldraw";
import "tldraw/tldraw.css";
import { useTldraw } from "@/contexts/TldrawContext";
import { act, useEffect } from "react";

/**
 * use this child comp to grab values from hooks that must be used within the Tldraw component,
 * and set them in the TldrawContext for use outside of the Tldraw component (ie from the AppSidebar)
 */
function TldrawChild() {
  const { setMenuClipBoardEvents, setHelpers, setActions } = useTldraw();
  const menuClipBoardEvents = useMenuClipboardEvents();
  const helpers = useDefaultHelpers();
  const actions = useActions();

  // Set clipboard events when they're available
  useEffect(() => {
    setMenuClipBoardEvents(menuClipBoardEvents);
    setHelpers(helpers);
    setActions(actions);
  }, []);

  return null;
}

interface CustomTldrawProps {
  pKey: string;
}

export default function CustomTldraw({ pKey }: CustomTldrawProps) {
  const { setEditor } = useTldraw();
  setUserPreferences({ id: "static", colorScheme: "dark" });

  return (
    <Tldraw
      onMount={(editor) => {
        setEditor(editor);
      }}
      className="rounded-lg"
      options={{ maxPages: 1 }}
      persistenceKey={pKey}
    >
      <TldrawChild />
    </Tldraw>
  );
}
