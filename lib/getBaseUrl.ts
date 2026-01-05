export function getBaseUrl() {
  // On Vercel this is automatically set, e.g. "event-platform-6kvx.vercel.app"
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Local development fallback
  return "http://localhost:3000";
}
