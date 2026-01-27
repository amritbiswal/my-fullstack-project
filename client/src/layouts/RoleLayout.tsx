import { Outlet } from "react-router-dom";
import { AppShell } from "../components/app/AppShell";

export function RoleLayout({ title }: { title: string }) {
  return (
    <AppShell title={title} showBottomNav={false}>
      <Outlet />
    </AppShell>
  );
}
