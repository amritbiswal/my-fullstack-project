import { createBrowserRouter } from "react-router-dom";
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

import { ProviderOnboardingPage } from "../features/provider/pages/ProviderOnboardingPage";
import { ProviderInventoryListPage } from "../features/provider/pages/ProviderInventoryListPage";
import { ProviderUnitCreatePage } from "../features/provider/pages/ProviderUnitCreatePage";
import { ProviderUnitDetailPage } from "../features/provider/pages/ProviderUnitDetailPage";
import { StaffQueuePage } from "../features/staff/pages/StaffQueuePage";
import { StaffTaskDetailPage } from "../features/staff/pages/StaffTaskDetailPage";
import { PartnerScanPage } from "../features/partner/pages/PartnerScanPage";
import { AdminCategoriesPage } from "../features/admin/pages/AdminCategoriesPage";
import { AdminSkusPage } from "../features/admin/pages/AdminSkusPage";

// (Auth pages assumed you already have; keep placeholders if needed)
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";

import { NotFoundPage } from "../features/system/NotFoundPage";
import { NotAuthorizedPage } from "../features/system/NotAuthorizedPage";
import { ProviderDashboardPage } from "../features/provider/pages/ProviderDashboardPage";
import { AdminDashboardPage } from "../features/admin/pages/AdminDashboardPage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <div className="p-6">Packless</div> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/not-authorized", element: <NotAuthorizedPage /> },
    ],
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
          { path: "/app/profile/pass", element: <PassPage /> },
        ],
      },

      // Provider
      {
        element: (
          <RoleRoute allowed={["PROVIDER_INDIVIDUAL", "PROVIDER_BUSINESS", "ADMIN"]} />
        ),
        children: [
          {
            element: <RoleLayout title="Provider" showBottomNav={true} />,
            children: [
              {
                path: "/provider/dashboard",
                element: <ProviderDashboardPage />,
              },
              {
                path: "/provider/onboarding",
                element: <ProviderOnboardingPage />,
              },
              {
                path: "/provider/inventory",
                element: <ProviderInventoryListPage />,
              },
              {
                path: "/provider/inventory/new",
                element: <ProviderUnitCreatePage />,
              },
              {
                path: "/provider/inventory/:unitId",
                element: <ProviderUnitDetailPage />,
              },
            ],
          },
        ],
      },

      // Staff
      {
        element: <RoleRoute allowed={["STAFF_VERIFIER", "ADMIN"]} />,
        children: [
          {
            element: <RoleLayout title="Staff" showBottomNav={true} />,
            children: [
              { path: "/staff/queue", element: <StaffQueuePage /> },
              { path: "/staff/task/:taskId", element: <StaffTaskDetailPage /> },
            ],
          },
        ],
      },

      // Partner
      {
        element: <RoleRoute allowed={["PARTNER"]} />,
        children: [
          {
            element: <RoleLayout title="Partner" showBottomNav={true} />,
            children: [{ path: "/partner/scan", element: <PartnerScanPage /> }],
          },
        ],
      },

      // Admin
      {
        element: <RoleRoute allowed={["ADMIN"]} />,
        children: [
          {
            element: <RoleLayout title="Admin" showBottomNav={true} />,
            children: [
              {
                path: "/admin/dashboard",
                element: <AdminDashboardPage />
              },
              {
                path: "/admin/catalog/categories",
                element: <AdminCategoriesPage />,
              },
              { path: "/admin/catalog/skus", element: <AdminSkusPage /> },
            ],
          },
        ],
      },
    ],
  },
  // Catch-all for 404
  { path: "*", element: <NotFoundPage /> },
]);
