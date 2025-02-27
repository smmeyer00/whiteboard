// TODO: can probably remove this layout
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ docId: string }>;
}>) {
  return <>{children}</>;
}
