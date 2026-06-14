# Ooty Trails — Tourist Cab Booking Platform

A lightweight "mini-Ola/Uber" for a small family-run taxi fleet in Ooty (Nilgiris, Tamil Nadu).
It gives tourists a fast way to discover the fleet, see **live vehicle availability**, get an
**instant fare estimate** and **book online** — plus a secured **fleet-management portal** for the
owner (admin) and drivers.

Built as a **single Next.js 14 app** so it deploys end-to-end on **free tiers**
(Render free web service + MongoDB Atlas free cluster).

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
