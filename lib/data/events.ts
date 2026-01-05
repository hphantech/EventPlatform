import connectToDatabase from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function getEventBySlug(slug: string) {
  await connectToDatabase();
  const event = await Event.findOne({ slug }).lean();
  return event;
}

