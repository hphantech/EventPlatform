import React from "react";
import { notFound } from "next/navigation";
import type { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { cacheLife } from "next/cache";
import { getBaseUrl } from "@/lib/getBaseUrl";

export const dynamic = "force-dynamic";

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item, i) => (
        <li key={`${item}-${i}`}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag, i) => (
      <div className="pill" key={`${tag}-${i}`}>
        {tag}
      </div>
    ))}
  </div>
);

const EventDetails = async ({ slug }: { slug: string }) => {
  "use cache";
  cacheLife("hours");

  // ✅ Guard FIRST. Prevents /api/events/undefined during build/prerender.
  if (!slug) return notFound();

  const baseUrl = getBaseUrl();

  const request = await fetch(`${baseUrl}/api/events/${slug}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!request.ok) {
    if (request.status === 404) return notFound();
    const text = await request.text().catch(() => "");
    console.error("Failed to fetch event:", request.status, request.statusText, text.slice(0, 120));
    return notFound();
  }

  const ct = request.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    const text = await request.text().catch(() => "");
    console.error("Non-JSON response when fetching event:", ct, text.slice(0, 120));
    return notFound();
  }

  const response = await request.json();

  // ✅ Your API returns { success: true, data: event }
  const event = response?.data;

  if (!event?.description) return notFound();

  const {
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda = [],
    audience,
    tags = [],
    organizer,
  } = event as {
    description: string;
    image: string;
    overview: string;
    date: string;
    time: string;
    location: string;
    mode: string;
    agenda: string[];
    audience: string;
    tags: string[];
    organizer: string;
  };

  const bookings = 10;
  const similarEvents: IEvent[] = (await getSimilarEventsBySlug(slug)) ?? [];

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        <div className="content">
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
          </section>

          {Array.isArray(agenda) && agenda.length > 0 && (
            <EventAgenda agendaItems={agenda} />
          )}

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          {Array.isArray(tags) && tags.length > 0 && <EventTags tags={tags} />}
        </div>

        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}

            {/* ✅ Use route slug, not event.slug */}
            <BookEvent eventId={event._id} slug={slug} />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 ? (
            similarEvents.map((similarEvent: any) => (
              <EventCard
                key={(similarEvent._id ?? similarEvent.id ?? similarEvent.title)?.toString()}
                {...similarEvent}
              />
            ))
          ) : (
            <p>No similar events found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
