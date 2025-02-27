import { AppSidebar } from "@/components/AppSidebar";
import CustomTldraw from "@/components/CustomTldraw";
import { TldrawProvider } from "@/contexts/TldrawContext";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const clerkUser = await currentUser();
  const docId = (await params).docId;

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
            <CustomTldraw pKey={docId} />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TldrawProvider>
  );
}
