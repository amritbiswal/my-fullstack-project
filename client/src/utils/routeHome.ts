export function homeForRole(role?: string) {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "STAFF_VERIFIER":
      return "/staff/queue";
    case "PARTNER":
      return "/partner/scan";
    case "PROVIDER_INDIVIDUAL":
    case "PROVIDER_BUSINESS":
      return "/provider/dashboard";
    default:
      return "/app/home";
  }
}
