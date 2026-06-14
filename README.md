# Ooty Trails — Tourist Cab Booking Platform

A lightweight "mini-Ola/Uber" for a small family-run taxi fleet in Ooty (Nilgiris, Tamil Nadu).
It gives tourists a fast way to discover the fleet, see **live vehicle availability**, get an
**instant fare estimate** and **book online** — plus a secured **fleet-management portal** for the
owner (admin) and drivers.

Built as a **single Next.js 14 app** so it deploys end-to-end on **free tiers**
(Render free web service + MongoDB Atlas free cluster).

---

## ✨ Features

**Public website**
- Vibrant, mobile-first, SEO-friendly landing page (hero, services, why-us, vehicle categories, live fleet, destinations, testimonials, CTA, contact)
- Online **booking** with live **distance + fare estimate** and a generated **booking reference**
- **Live fleet availability** (auto-refreshes every 15s)
- Rich **Ooty tourist guide** (attractions, tips, itineraries), **About** and **Contact** pages
- WhatsApp / phone / Instagram integration

**Admin portal** (`/portal/admin`)
- Dashboard with revenue, customers, live vehicles & bookings
- Bookings management — accept / reject / assign vehicle (auto-pulls driver) / complete
- Vehicles CRUD with rates & driver assignment
- Drivers CRUD + vehicle assignment
- Customers database (auto-built from bookings)
- **Analytics** with interactive charts (revenue, bookings by status, customer growth, fleet utilization)

**Driver portal** (`/portal/driver`)
- View assigned vehicle, update **live status** with one tap (instantly reflected on the public site)
- See current/upcoming assigned trips
- **Ferry / trip history** with earnings & distance summary

---

## 🧱 Tech Stack

| Layer        | Choice                                            |
| ------------ | ------------------------------------------------- |
| Framework    | Next.js 14 (App Router) + TypeScript              |
| Styling      | Tailwind CSS                                      |
| Database     | MongoDB Atlas + Mongoose                          |
| Auth         | JWT (jose) in httpOnly cookies + bcrypt           |
| Validation   | Zod + react-hook-form                             |
| Charts       | Recharts                                          |
| Realtime     | Lightweight client polling (SWR)                  |
| Pricing      | Fixed per-package fares (car vs Xylo) — see `lib/constants.ts` |

---

## 🚀 Local Setup

**Prerequisites:** Node.js 18.18+ (20 recommended) and a free MongoDB Atlas cluster.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
#   → set MONGODB_URI and JWT_SECRET (see below)

# 3. Seed an admin + sample drivers + ~7 vehicles
npm run seed

# 4. Run the dev server
npm run dev
# open http://localhost:3000
```

After seeding, log in at **/portal/login**:
- **Admin:**  `admin@ooty.in` / the `ADMIN_SEED_PASSWORD` you set
- **Driver:** `driver1@ooty.in` / `driver123` (also `driver2…driver4@ooty.in`)

---

## 🔑 Environment Variables

| Variable                     | Required | Description |
| ---------------------------- | -------- | ----------- |
| `MONGODB_URI`                | ✅       | MongoDB Atlas connection string |
| `JWT_SECRET`                 | ✅       | Random secret for signing sessions (`openssl rand -base64 48`) |
| `NEXT_PUBLIC_SITE_URL`       | ✅       | Public base URL (for SEO/sitemap) |
| `NEXT_PUBLIC_PHONE`          | ➖       | Business phone shown on the site |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`| ➖       | WhatsApp number incl. country code (e.g. `91…`) |
| `NEXT_PUBLIC_INSTAGRAM`      | ➖       | Instagram profile URL |
| `ADMIN_SEED_EMAIL`           | ➖       | Admin email created by the seed script |
| `ADMIN_SEED_PASSWORD`        | ➖       | Admin password created by the seed script |

> Pricing is **fixed per package**. Each package has a set fare for the car (Etios) and the SUV (Xylo),
> defined in `lib/constants.ts` (`PACKAGES`); the operator confirms the booking before the trip.

---

## 🗄️ MongoDB Atlas Setup (free)

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas) and a **free M0 cluster**.
2. **Database Access** → add a database user (username + password).
3. **Network Access** → add IP `0.0.0.0/0` (allow from anywhere — required for Render).
4. **Connect → Drivers** → copy the connection string and put it in `MONGODB_URI`
   (append a DB name, e.g. `…mongodb.net/ootygo?retryWrites=true&w=majority`).
5. Run `npm run seed` to populate initial data.

---

## ☁️ Deploy to Render (free)

This app runs as a single Node web service (it needs a Node runtime for MongoDB + JWT middleware).

**Option A — Blueprint (recommended):**
1. Push this repo to GitHub.
2. In Render: **New → Blueprint** → select the repo. It reads [`render.yaml`](./render.yaml).
3. After the service is created, open **Environment** and set the secret vars:
   `MONGODB_URI`, `NEXT_PUBLIC_SITE_URL` (your Render URL), `NEXT_PUBLIC_INSTAGRAM`,
   and `GOOGLE_MAPS_API_KEY` if used. (`JWT_SECRET` is auto-generated.)
4. Deploy. Build = `npm install && npm run build`, start = `npm start`.

**Option B — Manual web service:**
- New → **Web Service** → connect repo → Runtime **Node**, Plan **Free**
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Add the env vars listed above; Health Check Path: `/api/health`

**Avoid cold starts (free tier sleeps after ~15 min idle):**
Create a free cron at [cron-job.org](https://cron-job.org) hitting
`https://<your-app>.onrender.com/api/health` every ~10 minutes.

---

## 🌩️ A note on Cloudflare

The brief mentioned Cloudflare Pages. This project is a **full-stack Node app** (server-side
MongoDB over TCP + JWT middleware), which Cloudflare Pages/Workers can't host directly. So the
deploy target is **Render**. If you later want Cloudflare's CDN/static hosting, the public marketing
pages could be split into a static export and served from Cloudflare Pages while this app provides the
API — that's a future option and not required for the MVP.

---

## 📁 Project Structure

```
app/
  (public)/      Public website (landing, book, fleet, guide, about, contact)
  (portal)/      Login + admin & driver portals
  api/           Route handlers (bookings, estimate, fleet, auth, admin/*, driver/*)
  sitemap.ts robots.ts
components/
  public/  portal/  ui/
lib/        db, auth, api helpers, distance/fare engine, validation, content, constants
models/     User, Vehicle, Booking, Customer, ContactMessage
middleware.ts   Edge route protection for /portal & /api (admin/driver)
scripts/seed.ts Seed admin + drivers + vehicles
render.yaml     Render blueprint
```

---

## 🧭 Architecture Notes

- **Auth:** JWT stored in an httpOnly cookie; `middleware.ts` guards `/portal/(admin|driver)` and
  `/api/(admin|driver)` at the edge; route handlers re-check roles (defense in depth).
- **Realtime availability:** drivers/admin write status to MongoDB; public pages poll
  `/api/fleet/status` every 15s — simple, free, no WebSockets.
- **Fare engine:** fixed package pricing — `PACKAGES` in `lib/constants.ts`; the booking API applies the package + vehicle fare server-side.

---

## 🔮 Designed for future growth

The schema and structure leave room for: online payments, GPS tracking, multiple fleet owners,
a driver mobile app, SMS/WhatsApp notifications and dynamic pricing — without re-architecting.

---

## 🖼️ Replacing placeholder images

Search the codebase for **`Replace with image of`** to find every spot that expects a real photo
(hero, vehicle cards, destinations, etc.). For vehicles, just paste an image URL in the admin
**Vehicles** form. For marketing sections, drop real assets into `public/` and swap the
`<Placeholder />` components for `<Image />`.
```
