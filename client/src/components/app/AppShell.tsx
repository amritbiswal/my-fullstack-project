import React from "react";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";

export function AppShell({
  title,
  children,
  showBottomNav = true,
}: {
  title?: string;
  children: React.ReactNode;
  showBottomNav?: boolean;
}) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[560px] bg-slate-50 min-h-screen">
        <TopBar title={title ?? "Packless"} />
        <main className="px-4 pb-24 pt-3">{children}</main>
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
