import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Editor, TLImageExportOptions } from "tldraw";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function tldrawExport(
  editor: Editor | null,
  fName: string,
  opts: TLImageExportOptions,
) {
  {
    if (!editor) return;

    const shapeIds = Array.from(editor.getPageShapeIds(editor.getPages()[0]));

    if (shapeIds.length === 0) {
      toast.error("Error", {
        description: "Cannot export empty document",
      });
      return;
    }

    const blob = await editor?.toImage(shapeIds, opts);

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
