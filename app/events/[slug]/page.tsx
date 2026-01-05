import { notFound } from "next/navigation";
import Image from "next/image";
import { Book } from "lucide-react";
import BookEvent from "@/components/BookEvent";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const EventDetailItem = ({icon, label, alt} : {icon: string, label: string, alt: string}) => (
  <div className="flex flex-row gap-2 items-center">
    <Image src={icon} alt={alt} width={24} height={24} />
    <span>{label}</span>
  </div>
)

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
)

const EventAgenda = ({agendaItems} : {agendaItems: string[]}) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
)

const EventDetailsPage = async({params} : {params: Promise<{slug: string}>}) => {
  const { slug } = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`, {cache: 'no-store'})

  const { data : {description, image, overview, date, time, location, mode, agenda, audience, tags, organizer }} = await request.json()

  if (!description) return notFound();

  const bookings = 10;

  
  return (
    <section id="event">
      <div className="header">
        <h1>Event</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        {/* Left side */}
        <div className="content">
          <Image src={image} alt={description} width={800} height={400} className="banner" />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>

          </section>

          <section className="flex-col-gap-2">
            <h1>event details</h1>
            <EventDetailItem icon="/icons/calendar.svg" alt="Date" label={date}/>
            <EventDetailItem icon="/icons/clock.svg" alt="time" label={time}/>
            <EventDetailItem icon="/icons/pin.svg" alt="location" label={location}/>
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode}/>
            <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience}/>
          </section>

          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>Organizer</h2>
            <p>{organizer}</p>
          </section>
          <EventTags tags={tags} />
        </div>
        {/* Rights side */}

        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm"> join {bookings} people who have already booked this event</p>
            ) : (
              <p className="text-sm">Be the first to book a spot for this event!</p>
            )
          }

          <BookEvent />
          </div>
        </aside>


      </div>
    </section>
  )
}

export default EventDetailsPage