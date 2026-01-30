# 📦 Packless – Backend API

**Travel light. Rent locally.**

---

## Overview

Packless is a location-based rental marketplace backend that enables tourists to rent verified items (clothes, daily wares, gear, electronics, etc.) at their destination.
The platform separates catalog SKUs from physical units, ensuring that only staff-verified units become bookable.

This repository contains the backend REST API, authentication, role-based access control, inventory verification workflow, and booking engine.

---

## Design Philosophy

- **Modular, scalable, and secure**
- **Role-based access control**
- **Staff-verified inventory**
- **RESTful, clean, and maintainable**

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (role-based authorization)
- **Validation:** Zod & custom middleware
- **Architecture:** Modular (feature-based)
- **API Style:** REST

---

## Project Structure

```
server/
├─ app.js
├─ server.js
├─ routes/
│  ├─ auth.routes.js
│  ├─ public.routes.js
│  ├─ provider.routes.js
│  ├─ staff.routes.js
│  ├─ booking.routes.js
│  ├─ admin.routes.js
│  ├─ catalog.routes.js
│  └─ partner.routes.js
├─ modules/
│  ├─ auth/
│  ├─ catalog/
│  ├─ inventory/
│  ├─ booking/
│  ├─ provider/
│  ├─ staff/
│  └─ geo/
├─ models/
├─ middlewares/
├─ utils/
└─ config/
```

---

## Core Concepts

- **SKU (Catalog Item):** What tourists see (e.g. “Free-size rain jacket”)
- **Unit (Inventory Item):** Actual physical item owned by a provider
- **Verification Task:** Staff workflow to approve/reject units
- **Booking:** Time-bound allocation of a unit to a tourist
- **Roles:** TOURIST, PROVIDER, STAFF_VERIFIER, ADMIN, PARTNER

---

## Authentication & Roles

- JWT-based authentication
- Role guards on every route
- Single login system for:
  - Tourist
  - Provider (individual / business)
  - Staff verifier
  - Admin
  - Partner (future)

---

## Key API Modules

### Authentication

- `POST   /api/auth/register`
- `POST   /api/auth/login`
- `GET    /api/auth/me`

### Public Catalog

- `GET /api/public/cities`
- `GET /api/public/categories`
- `GET /api/public/skus`
- `GET /api/catalog/search`

### Provider

- `GET    /api/provider/skus`
- `POST   /api/provider/units`
- `POST   /api/provider/units/:id/submit`
- `GET    /api/provider/units`

### Staff Verification

- `GET    /api/staff/queue`
- `POST   /api/staff/:taskId/claim`
- `POST   /api/staff/:taskId/approve`
- `POST   /api/staff/:taskId/reject`
- `GET    /api/staff/units/:unitId/history`

### Booking

- `POST   /api/booking`
- `PATCH  /api/booking/:id/confirm`
- `GET    /api/booking/my`
- `GET    /api/booking/provider`

### Admin

- `POST   /api/admin/categories`
- `POST   /api/admin/skus`
- (CRUD for cities, zones, units, providers, enable/disable)

---

## MVP Features (Implemented)

- Role-based authentication
- Catalog (categories + SKUs)
- Provider inventory management
- Staff verification workflow
- Unit activation gating
- Tourist search by city/date
- Booking creation & confirmation
- Secure deposit model (logic-ready)

---

## Future Enhancements

- Payment gateway integration (Stripe/Razorpay)
- Automated availability engine
- Delivery partner workflow
- Packless Pass QR verification
- Dynamic pricing & surge
- Ratings & reviews
- Dispute handling
- Webhooks & event-driven flows

---

## Environment Setup

```bash
npm install
npm run dev
```

Create a `.env` file:

```
PORT=5005
MONGODB_URI=your_mongo_url
JWT_SECRET=your_secret
```

---

## License

MIT License

---

## Author

**Amrit**  
Full-Stack Dev  
Creator of Packless

---

© 2026 Packless. All rights reserved.
