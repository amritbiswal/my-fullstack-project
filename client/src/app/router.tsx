import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute, RoleRoute } from "../auth/guards";
import { PublicLayout } from "../layouts/PublicLayout";
import { TouristLayout } from "../layouts/TouristLayout";
import { RoleLayout } from "../layouts/RoleLayout";

import { TripSetupPage } from "../features/trip/pages/TripSetupPage";
import { HomePage } from "../features/catalog/pages/HomePage";
import { SearchPage } from "../features/catalog/pages/SearchPage";
import { CategoryPage } from "../features/catalog/pages/CategoryPage";
import { SkuDetailPage } from "../features/catalog/pages/SkuDetailPage";
import { CheckoutPage } from "../features/bookings/pages/CheckoutPage";
import { BookingsPage } from "../features/bookings/pages/BookingsPage";
import { BookingDetailPage } from "../features/bookings/pages/BookingDetailPage";
import { MessagesPage } from "../features/messages/pages/MessagesPage";
import { ProfilePage } from "../features/profile/pages/ProfilePage";
import { PassPage } from "../features/profile/pages/PassPage";

import { ProviderDashboard } from "../features/provider/pages/ProviderDashboard";
import { ProviderInventory } from "../features/provider/pages/ProviderInventory";
import { StaffQueue } from "../features/staff/pages/StaffQueue";
import { PartnerScan } from "../features/partner/pages/PartnerScan";
import { AdminCategories } from "../features/admin/pages/AdminCategories";
import { AdminSkus } from "../features/admin/pages/AdminSkus";

// (Auth pages assumed you already have; keep placeholders if needed)
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";

function NotAuthorized() {
  return <div className="p-6">Not authorized.</div>;
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <div className="p-6">Packless</div> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/not-authorized", element: <NotAuthorized /> }
    ]
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <TouristLayout />,
        children: [
          { path: "/app/trip", element: <TripSetupPage /> },
          { path: "/app/home", element: <HomePage /> },
          { path: "/app/search", element: <SearchPage /> },
          { path: "/app/categories/:categoryId", element: <CategoryPage /> },
          { path: "/app/sku/:skuId", element: <SkuDetailPage /> },
          { path: "/app/checkout/:skuId", element: <CheckoutPage /> },
          { path: "/app/bookings", element: <BookingsPage /> },
          { path: "/app/bookings/:bookingId", element: <BookingDetailPage /> },
          { path: "/app/messages", element: <MessagesPage /> },
          { path: "/app/profile", element: <ProfilePage /> },
          { path: "/app/profile/pass", element: <PassPage /> }
        ]
      },

      // Provider
      {
        element: <RoleRoute allowed={["PROVIDER_INDIVIDUAL", "PROVIDER_BUSINESS"]} />,
        children: [
          {
            element: <RoleLayout title="Provider" />,
            children: [
              { path: "/provider/dashboard", element: <ProviderDashboard /> },
              { path: "/provider/inventory", element: <ProviderInventory /> }
            ]
          }
        ]
      },

      // Staff
      {
        element: <RoleRoute allowed={["STAFF_VERIFIER", "ADMIN"]} />,
        children: [
          {
            element: <RoleLayout title="Staff" />,
            children: [{ path: "/staff/queue", element: <StaffQueue /> }]
          }
        ]
      },

      // Partner
      {
        element: <RoleRoute allowed={["PARTNER"]} />,
        children: [
          {
            element: <RoleLayout title="Partner" />,
            children: [{ path: "/partner/scan", element: <PartnerScan /> }]
          }
        ]
      },

      // Admin
      {
        element: <RoleRoute allowed={["ADMIN"]} />,
        children: [
          {
            element: <RoleLayout title="Admin" />,
            children: [
              { path: "/admin/catalog/categories", element: <AdminCategories /> },
              { path: "/admin/catalog/skus", element: <AdminSkus /> }
            ]
          }
        ]
      }
    ]
  }
]);
