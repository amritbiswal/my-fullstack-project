# 📱 Packless – Frontend (PWA)

**Mobile-first rental experience for travelers**

---

## Overview

Packless is a mobile-first, PWA-style web app that delivers a native-like rental experience for travelers. The frontend supports multiple user roles, each with a dedicated UI and workflow:

- **Tourists**
- **Providers**
- **Staff Verifiers**
- **Admins**

---

## Design Philosophy

- Mobile-first, app-like UX
- Clean, trustworthy, travel-friendly design
- Role-aware navigation
- Fast and responsive
- Scalable component architecture

---

## Tech Stack

- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State/Data:** TanStack React Query
- **Forms:** React Hook Form + Zod
- **Styling:** Tailwind CSS
- **Icons:** Lucide
- **PWA:** Vite PWA plugin

---

## Project Structure

```text
src/
├─ app/
│  └─ routes.tsx
├─ auth/
├─ features/
│  ├─ marketing/
│  ├─ auth/
│  ├─ trip/
│  ├─ catalog/
│  ├─ bookings/
│  ├─ provider/
│  ├─ staff/
│  ├─ admin/
│  └─ profile/
├─ components/
│  ├─ ui/
│  └─ app/
├─ api/
├─ utils/
└─ styles/
```

---

## Key Screens & Flows

### Public

- Landing page (Packless concept)
- Login / Register

### Tourist App

- Trip setup (city + dates)
- Home & search
- Category browsing
- SKU detail
- Checkout
- My bookings
- Profile & Packless Pass

### Provider Portal

- Dashboard
- Profile onboarding
- Inventory units
- Availability windows

### Staff Console

- Verification queue
- Task claim/release
- Unit approve/reject
- Verification history

### Admin Console

- Dashboard
- Category management
- SKU management

---

## MVP Features (Implemented)

- Responsive PWA-style UI
- Role-based routing & guards
- Staff verification UI
- Provider inventory flow
- Tourist booking flow
- API-integrated search & booking
- Clean, reusable UI system

---

## Future Enhancements

- QR-based Packless Pass
- Offline PWA support
- Push notifications
- Maps & location awareness
- In-app chat
- Reviews & ratings
- Multi-language support
- Dark mode

---

## Development Setup

```bash
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

---

## Deployment

- Works with Vercel / Netlify
- Backend-agnostic (API-driven)
- PWA ready

---

## License

MIT License

---

## Author

**Amrit**  
Full-Stack Dev  
Founder – Packless

---

## Copyright

© 2026 Packless. All rights reserved.
