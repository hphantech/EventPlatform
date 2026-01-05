import { Suspense } from "react";
import { notFound } from "next/navigation";
import EventDetails from "@/components/EventDetails";

export const dynamic = "force-dynamic";

export default function EventDetailsPage({ params }: { params: { slug?: string } }) {
  const slug = params?.slug;

  if (!slug) return notFound();

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <EventDetails slug={slug} />
      </Suspense>
    </main>
  );
}
