import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { getSimilarEvents } from "@/lib/actions/event.actions";
import type { IEvent } from "@/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({
  icon,
  label,
  alt,
}: {
  icon: string;
  label: string;
  alt: string;
}) => (
  <div className="flex flex-row gap-2 items-center">
    <Image src={icon} alt={alt} width={24} height={24} />
    <span>{label}</span>
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

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  if (!BASE_URL) return notFound();

  const res = await fetch(`${BASE_URL}/api/events/${slug}`, { cache: "no-store" });
  if (!res.ok) return notFound();

  const json = await res.json();
  const event = json?.data;

  if (!event?.description) return notFound();

  const {
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
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

  // IMPORTANT: getSimilarEvents must RETURN an array (fix in that file too)
  const similarEvents: IEvent[] = (await getSimilarEvents(slug)) ?? [];

  return (
    <section id="event">
      <div className="header">
        <h1>Event</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        {/* Left side */}
        <div className="content">
          <Image
            src={image}
            alt={description}
            width={800}
            height={400}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h1>event details</h1>
            <EventDetailItem icon="/icons/calendar.svg" alt="Date" label={date} />
            <EventDetailItem icon="/icons/clock.svg" alt="Time" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="Location" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="Mode" label={mode} />
            <EventDetailItem icon="/icons/audience.svg" alt="Audience" label={audience} />
          </section>

          {Array.isArray(agenda) && agenda.length > 0 && (
            <EventAgenda agendaItems={agenda} />
          )}

          <section className="flex-col-gap-2">
            <h2>Organizer</h2>
            <p>{organizer}</p>
          </section>

          {Array.isArray(tags) && tags.length > 0 && <EventTags tags={tags} />}
        </div>

        {/* Right side */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>

            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked this event
              </p>
            ) : (
              <p className="text-sm">Be the first to book a spot for this event!</p>
            )}

            <BookEvent />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>similar events</h2>

        <div className="events">
          {similarEvents.length > 0 ? (
            similarEvents.map((event: any) => (
              <EventCard
                key={(event.id ?? event._id)?.toString()}
                {...event}
                id={(event.id ?? event._id)?.toString()}
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

export default EventDetailsPage;
