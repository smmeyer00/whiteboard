import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ docId: string }>;
}>) {
  const docId = (await params).docId;

  return (
    <SidebarProvider>
      <AppSidebar docId={Number(docId)} />
      {/* <SidebarTrigger /> */} {/** TODO: add custom trigger later */}
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
