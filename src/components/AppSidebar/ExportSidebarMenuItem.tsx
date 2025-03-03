import { Download } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { tldrawExport } from "@/lib/utils";
import { useTldraw } from "@/contexts/TldrawContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Expand } from "lucide-react";
import { TLExportType } from "tldraw";
import { useWhiteboardQuery } from "@/hooks/whiteboard";
import { useParams } from "next/navigation";

export default function ExportSidebarMenuItem(): React.ReactNode {
  const { editor } = useTldraw();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [format, setFormat] = useState<TLExportType>("png");
  const [quality, setQuality] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [transparent, setTransparent] = useState<boolean>(false);
  const [padding, setPadding] = useState<number>(32);
  const [theme, setTheme] = useState<string>("dark");

  const { docId } = useParams<{ docId: string }>();
  const { data, isLoading, isError } = useWhiteboardQuery(Number(docId));

  const dialogSubmitHandler = () => {
    if (isLoading || isError || !data) return;

    tldrawExport(editor, `${data.name.replaceAll(/\s+/g, "_")}.${format}`, {
      format: format,
      quality: quality,
      scale: scale,
      background: !transparent,
      padding: padding,
      darkMode: theme === "dark",
    });
  };

  const resetButtonHandler = () => {
    setFormat("png");
    setQuality(1);
    setScale(1);
    setTransparent(false);
    setPadding(32);
    setTheme("dark");
  };

  // TODO: Move state values to be right aligned (Quality: 1 vs Quality --------------------------------- 1)

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <SidebarMenuItem>
        <DialogTrigger asChild>
          <SidebarMenuButton>
            <Download />
            <span>{"Export"}</span>
          </SidebarMenuButton>
        </DialogTrigger>
      </SidebarMenuItem>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export</DialogTitle>
          <DialogDescription>
            Download your document in a variety of formats
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="format">Format</Label>
            <Select
              defaultValue="png"
              value={format}
              onValueChange={(value: TLExportType) => setFormat(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="svg">SVG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quality" className="flex justify-between">
              <span>Quality:</span>
              <span>{quality.toFixed(1)}</span>
            </Label>
            <Slider
              value={[quality]}
              onValueChange={([value]) => setQuality(value)}
              max={1}
              min={0.1}
              step={0.1}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="scale" className="flex justify-between">
              <span>Scale:</span>
              <span>{scale.toFixed(1)}x</span>
            </Label>
            <Slider
              value={[scale]}
              onValueChange={([value]) => setScale(value)}
              max={5}
              min={0.1}
              step={0.1}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="transparent"
              checked={transparent}
              onCheckedChange={(checked) => setTransparent(!!checked)}
            />
            <Label htmlFor="transparent">Transparent background</Label>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="padding" className="flex justify-between">
              <span>Padding:</span>
              <span>{padding}px</span>
            </Label>
            <Slider
              value={[padding]}
              onValueChange={([value]) => setPadding(value)}
              max={128}
              min={8}
              step={8}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="theme">Theme</Label>
            <Select defaultValue="dark" value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark mode</SelectItem>
                <SelectItem value="light">Light mode</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button onClick={resetButtonHandler} variant={"ghost"}>
            Reset
          </Button>
          <Button onClick={dialogSubmitHandler} type="submit">
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
