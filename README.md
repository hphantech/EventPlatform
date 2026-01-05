Dev Event Platform (Next.js 16)

This is an event platform built with Next.js 16, MongoDB, Cloudinary, and PostHog.

The app works correctly in local development. Events can be created, listed, and viewed via dynamic routes. Images upload through Cloudinary and bookings are tracked with PostHog.

The project currently does not deploy successfully to production.

The reason is a limitation in Next.js 16’s Cache Components. Dynamic routes that rely on runtime data (MongoDB / API fetches) are forced into prerendering during the build process. This causes the build to fail and cannot be resolved at the application level without removing Cache Components entirely.

This is a framework constraint, not a bug in the project logic or data layer.

To run locally:
- install dependencies
- set environment variables
- run `npm run dev`
