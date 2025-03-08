"use client";

import {
  StoreSnapshot,
  TLEditorSnapshot,
  TLRecord,
  TLStoreSnapshot,
  TLUiComponents,
  Tldraw,
  createTLStore,
  getSnapshot,
  loadSnapshot,
  setUserPreferences,
  useActions,
  useDefaultHelpers,
  useMenuClipboardEvents,
} from "tldraw";
import "tldraw/tldraw.css";
import { useTldraw } from "@/contexts/TldrawContext";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  useUpdateWhiteboardMutation,
  useWhiteboardQuery,
} from "@/hooks/whiteboard";
import { throttle, isEqual, debounce, first } from "lodash";

const components: Partial<TLUiComponents> = {
  // ContextMenu: null,
  ActionsMenu: null,
  HelpMenu: null,
  ZoomMenu: null,
  MainMenu: null,
  Minimap: null,
  // StylePanel: null,
  PageMenu: null,
  NavigationPanel: null,
  // Toolbar: null,
  KeyboardShortcutsDialog: null,
  QuickActions: null,
  // HelperButtons: null,
  // DebugPanel: null,
  // DebugMenu: null,
  // SharePanel: null,
  // MenuPanel: null,
  // TopPanel: null,
  // CursorChatBubble: null,
  // Dialogs: null,
  // Toasts: null,
};

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
  docId: string;
}

export default function CustomTldraw({ docId }: CustomTldrawProps) {
  const [firstLoadDone, setFirstLoadDone] = useState(false);

  const { editor, setEditor, setIsSynced } = useTldraw();
  setUserPreferences({ id: "static", colorScheme: "dark" });
  useEffect(() => {
    editor?.updateInstanceState({ isGridMode: true });
  }, [editor]);

  const store = useMemo(() => createTLStore(), []);
  const {
    data,
    isLoading,
    isError: isQueryError,
  } = useWhiteboardQuery(Number(docId));
  const {
    mutate,
    isSuccess,
    isError: isUpdateError,
  } = useUpdateWhiteboardMutation();
  useLayoutEffect(() => {
    // initial load
    if (isLoading) return;

    if (data?.content) {
      console.log("content: ", data.content);
      try {
        loadSnapshot(
          store,
          data.content as Partial<TLEditorSnapshot> | TLStoreSnapshot,
        );
      } catch (error: any) {
        console.error("Uh oh, problem loading whiteboard data");
        // TODO: pop some modal or error screen w/ redirect back to home or retry button
      }
    }

    const cleanupFn = store.listen(
      throttle(() => {
        const snapshot = getSnapshot(store);
        if (
          isEqual(
            JSON.parse(JSON.stringify(data?.content)),
            JSON.parse(JSON.stringify(snapshot)),
          )
        ) {
          return;
        }
        console.log("Syncing diagram content");
        mutate({
          id: Number(docId),
          data: {
            content: JSON.parse(JSON.stringify(snapshot)),
          },
        });
      }, 1500),
    );

    return () => {
      cleanupFn();
    };
  }, [store, isLoading]);

  useLayoutEffect(() => {
    const cFunc = store.listen(
      throttle(() => {
        try {
          const currentSnapshot = JSON.parse(
            JSON.stringify(getSnapshot(store)),
          );
          const savedContent = JSON.parse(JSON.stringify(data?.content));
          setIsSynced(isEqual(currentSnapshot, savedContent));
          console.log("Setting isSynced");
        } catch (error: any) {
          console.error("Session state probably not ready yet");
        }
      }, 500), // TODO: this isnt firing immediately after releasing 'draw', but only fires when mouse moves after that
      // figure out how to fix above w/ current event driven setup, or just set it to run periodicaly if needed
    );
    return () => {
      cFunc();
    };
  }, [data, store]);

  return (
    <Tldraw
      onMount={(editor) => {
        setEditor(editor);
      }}
      className="rounded-lg"
      options={{ maxPages: 1 }}
      store={store}
      components={components}
    >
      <TldrawChild />
    </Tldraw>
  );
}
