````md
# Dev Event Platform (Next.js 16)

Event platform built with **Next.js 16**, MongoDB, Cloudinary, and PostHog.

The project works in local development but currently fails to deploy due to **Next.js 16 Cache Components limitations with dynamic routes**.

---

## What it does

- Lists developer events on the homepage  
- Creates and stores events in MongoDB  
- Uploads images via Cloudinary  
- Dynamic event pages: `/events/[slug]`  
- Tracks bookings with PostHog  

---

## Tech stack

- Next.js 16 (App Router, Cache Components)
- TypeScript
- Tailwind CSS
- MongoDB + Mongoose
- Cloudinary
- PostHog

---

## Status

- ✅ Worked locally (`npm run dev`)
- ❌ Production build fails on Vercel

### Reason

Next.js 16 enforces Cache Components globally.  
Dynamic routes that require uncached runtime data (MongoDB / API fetch) fail during `next build`.

This is a **framework constraint**, not a logic or data issue.

---

## Run locally

```bash
npm install
npm run dev
````

