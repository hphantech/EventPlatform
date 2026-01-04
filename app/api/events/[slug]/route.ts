import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
  try {
    // ✅ unwrap params (Next says it's a Promise)
    const { slug } = await ctx.params;

    const cleaned = slug?.trim();
    if (!cleaned) {
      return NextResponse.json(
        { error: "Invalid or missing slug parameter" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const event = await Event.findOne({ slug: cleaned }).lean();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event }, { status: 200 });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching the event" },
      { status: 500 }
    );
  }
}
