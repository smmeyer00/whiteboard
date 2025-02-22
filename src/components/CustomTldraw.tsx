"use client";

import { setUserPreferences, Tldraw, TldrawOptions } from "tldraw";
import "tldraw/tldraw.css";

export default function CustomTldraw() {
  // use same id string so dark mode is always on
  setUserPreferences({ id: "static", colorScheme: "dark" });

  return <Tldraw className="rounded-lg" options={{}} />;
}
