import Link from "next/link";
import React, { FC } from "react";

export default function HomePage(): React.ReactNode {
  return (
    <div className="h-screen w-full items-center justify-center flex flex-col">
      <Link href="/d/1">click me to go to whiteboard 1</Link>
    </div>
  );
}
