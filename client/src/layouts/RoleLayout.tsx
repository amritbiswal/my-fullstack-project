import { Outlet } from "react-router-dom";
import { AppShell } from "../components/app/AppShell";

export function RoleLayout({ title, showBottomNav }: { title: string; showBottomNav: boolean }) {
  return (
    <AppShell title={title} showBottomNav={showBottomNav}>
      <Outlet />
    </AppShell>
  );
}
