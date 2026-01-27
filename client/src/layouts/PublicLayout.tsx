import { Outlet } from "react-router-dom";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[560px] min-h-screen bg-white">
        <Outlet />
      </div>
    </div>
  );
}
