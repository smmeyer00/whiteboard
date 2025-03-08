"use client";

import { AppSidebar } from "@/components/AppSidebar";
// import CustomTldraw from "@/components/CustomTldraw";
const CustomTldraw = dynamic(() => import("@/components/CustomTldraw"), {
  ssr: false,
});
import { TldrawProvider } from "@/contexts/TldrawContext";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useWhiteboardQuery } from "@/hooks/whiteboard";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

export default function Home() {
  const { docId } = useParams<{ docId: string }>();
  const router = useRouter();

  const { data, isLoading } = useWhiteboardQuery(Number(docId));

  /**
   * TODO:  need to handle primary key syncing w/ Tanstack Query syncing.
   *        Make sure no race conditions. One will need to be prioritized over the other.
   *        Probably favor cloud sync over local state, but can still initially load local state for better FCP (first contentful paint) latency although this could cause race conditions.
   *        Prefer only cloud sync if latency is acceptable.
   */

  return (
    <TldrawProvider>
      <SidebarProvider>
        <AppSidebar docId={Number(docId)} />
        {/* <SidebarTrigger /> */} {/** TODO: add custom trigger later */}
        <SidebarInset>
          <div className="w-full h-full space-y-8 p-2 pl-0 rounded-lg overflow-hidden">
            <CustomTldraw docId={docId} />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TldrawProvider>
  );
}
