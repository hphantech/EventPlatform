import { getEventBySlug } from "@/lib/data/events";

export default async function EventDetails({ slug }: { slug: string }) {
  const event = await getEventBySlug(slug);

  return (
    <div style={{ padding: 40 }}>
      <h1>DEBUG EVENT</h1>
      <p>slug: {String(slug)}</p>
      <p>found: {event ? "YES" : "NO"}</p>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(event, null, 2)}
      </pre>
    </div>
  );
}
