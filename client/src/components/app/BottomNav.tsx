import { NavLink } from "react-router-dom";
import { Home, Search, Calendar, MessageCircle, User } from "lucide-react";

const tabs = [
  { to: "/app/home", label: "Home", Icon: Home },
  { to: "/app/search", label: "Search", Icon: Search },
  { to: "/app/bookings", label: "Bookings", Icon: Calendar },
  { to: "/app/messages", label: "Messages", Icon: MessageCircle },
  { to: "/app/profile", label: "Profile", Icon: User }
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-[560px] border-t border-slate-100 bg-white">
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center rounded-xl px-2 py-2 text-xs ${
                isActive ? "text-teal-700" : "text-slate-500"
              }`
            }
          >
            <Icon size={20} />
            <span className="mt-1">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
