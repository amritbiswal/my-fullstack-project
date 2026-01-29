import { NavLink } from "react-router-dom";
import {
  Home,
  Search,
  Calendar,
  MessageCircle,
  User,
  Package,
  Settings,
  Users,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

const touristTabs = [
  { to: "/app/home", label: "Home", Icon: Home },
  { to: "/app/search", label: "Search", Icon: Search },
  { to: "/app/bookings", label: "Bookings", Icon: Calendar },
  { to: "/app/messages", label: "Messages", Icon: MessageCircle },
  { to: "/app/profile", label: "Profile", Icon: User },
];

const providerTabs = [
  { to: "/provider/dashboard", label: "Dashboard", Icon: Home },
  { to: "/provider/inventory", label: "Inventory", Icon: Package },
  { to: "/provider/onboarding", label: "Onboarding", Icon: Settings },
  { to: "/app/messages", label: "Messages", Icon: MessageCircle },
  { to: "/app/profile", label: "Profile", Icon: User },
];

const adminTabs = [
  { to: "/admin/catalog/categories", label: "Categories", Icon: Package },
  { to: "/admin/catalog/skus", label: "SKUs", Icon: Package },
  { to: "/admin/users", label: "Users", Icon: Users },
  { to: "/app/messages", label: "Messages", Icon: MessageCircle },
  { to: "/app/profile", label: "Profile", Icon: User },
];

export function BottomNav() {
  const { user } = useAuth();

  let tabs = touristTabs;
  if (user?.role === "ADMIN") {
    tabs = adminTabs;
  } else if (
    user?.role === "PROVIDER_INDIVIDUAL" ||
    user?.role === "PROVIDER_BUSINESS"
  ) {
    tabs = providerTabs;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-[560px] border-t border-slate-100 bg-white">
      <div className={`grid grid-cols-${tabs.length} gap-1 px-2 py-2`}>
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

// import { NavLink } from "react-router-dom";
// import { Home, Search, Calendar, MessageCircle, User } from "lucide-react";

// const tabs = [
//   { to: "/app/home", label: "Home", Icon: Home },
//   { to: "/app/search", label: "Search", Icon: Search },
//   { to: "/app/bookings", label: "Bookings", Icon: Calendar },
//   { to: "/app/messages", label: "Messages", Icon: MessageCircle },
//   { to: "/app/profile", label: "Profile", Icon: User }
// ];

// export function BottomNav() {
//   return (
//     <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-[560px] border-t border-slate-100 bg-white">
//       <div className="grid grid-cols-5 gap-1 px-2 py-2">
//         {tabs.map(({ to, label, Icon }) => (
//           <NavLink
//             key={to}
//             to={to}
//             className={({ isActive }) =>
//               `flex flex-col items-center justify-center rounded-xl px-2 py-2 text-xs ${
//                 isActive ? "text-teal-700" : "text-slate-500"
//               }`
//             }
//           >
//             <Icon size={20} />
//             <span className="mt-1">{label}</span>
//           </NavLink>
//         ))}
//       </div>
//     </nav>
//   );
// }
