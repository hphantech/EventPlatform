import Link from "next/link"
import Image from "next/image"

interface Props {
  title: string;
  image: string;
}

const EventCard = ({title, image}: Props) => {
  return (
    <Link href={`/events`} id="event-card" className="event-card">
      <Image src={image} alt={title} width={200} height={150} className="poster" />
      <h4>{title}</h4>
    </Link>
  )
}

export default EventCard