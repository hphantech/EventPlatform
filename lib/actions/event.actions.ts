'use server';

import connectToDatabase from '@/lib/mongodb'
import Event from '@/database/event.model'

export const getSimilarEvents = async (slug: string) => {
  try {
    await connectToDatabase();

    const event = await Event.findOne({ slug }).lean();
    if (!event) return [];

    const docs = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    })
      .limit(6)
      .lean();

    // Convert ObjectId + Dates to strings so Client Components can accept it
    return docs.map((e: any) => ({
      ...e,
      _id: e._id?.toString(),
      createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : undefined,
      updatedAt: e.updatedAt ? new Date(e.updatedAt).toISOString() : undefined,
    }));
  } catch (err) {
    console.error("getSimilarEvents error:", err);
    return [];
  }
};
