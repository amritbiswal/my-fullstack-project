import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow flex justify-around py-2 z-50">
      <Link to="/" className={pathname === "/" ? "text-blue-600" : ""}>Home</Link>
      <Link to="/profile" className={pathname === "/profile" ? "text-blue-600" : ""}>Profile</Link>
    </nav>
  );
}