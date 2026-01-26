import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.page";
import Login from "./pages/login.page";
import Register from "./pages/register.page";
import Profile from "./pages/profile.page";
import ProviderPage from "./pages/provider.page";
import StaffPage from "./pages/staff.page";
import AdminPage from "./pages/admin.page";
import PartnerPage from "./pages/partner.page";
import ProtectedRoute from "./components/ProtectedRoute.component";
import BottomNav from "./components/BottomNav.component";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="pb-16"> {/* padding for bottom nav */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/provider"
            element={
              <ProtectedRoute allowedRoles={["PROVIDER_INDIVIDUAL", "PROVIDER_BUSINESS"]}>
                <ProviderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={["STAFF_VERIFIER", "ADMIN"]}>
                <StaffPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner"
            element={
              <ProtectedRoute allowedRoles={["PARTNER", "DELIVERY_PARTNER"]}>
                <PartnerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
        {user && <BottomNav />}
      </div>
    </Router>
  );
}

export default App;