import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Editor, TLImageExportOptions } from "tldraw";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function tldrawExport(
  editor: Editor | null,
  fName: string,
  opts: TLImageExportOptions,
) {
  {
    const blob = await editor?.toImage(
      Array.from(editor.getPageShapeIds(editor.getPages()[0])),
      opts,
    );

    if (!blob?.blob) return;

    // Create download link
    const url = URL.createObjectURL(blob?.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fName;
    a.click();

    // Cleanup
    URL.revokeObjectURL(url);
  }
}
