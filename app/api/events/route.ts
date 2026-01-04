import connectToDatabase from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";

function parseJsonArrayField(value: unknown, fieldName: string): string[] {
  if (Array.isArray(value)) return value.map(String);

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) throw new Error();
      return parsed.map(String);
    } catch {
      throw new Error(`${fieldName} must be a valid JSON array string`);
    }
  }

  throw new Error(`${fieldName} is required`);
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json({ message: "invalid form data" }, { status: 400 });
    }

    const eventData = Object.fromEntries(formData.entries()) as Record<string, any>;

    try {
      eventData.agenda = parseJsonArrayField(eventData.agenda, "agenda");
      eventData.tags = parseJsonArrayField(eventData.tags, "tags");
    } catch (err) {
      return NextResponse.json(
        { message: err instanceof Error ? err.message : "invalid agenda/tags" },
        { status: 400 }
      );
    }

    const file = formData.get("image");
    if (!(file instanceof File)) {
      return NextResponse.json({ message: "image file is required" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image", folder: "events" }, (error, result) => {
          if (error) return reject(error);
          if (!result?.secure_url) return reject(new Error("Cloudinary upload failed"));
          resolve({ secure_url: result.secure_url });
        })
        .end(buffer);
    });

    const createdEvent = await Event.create({
      title: eventData.title,
      description: eventData.description,
      overview: eventData.overview,
      image: uploadResult.secure_url,
      venue: eventData.venue,
      location: eventData.location,
      date: eventData.date,
      time: eventData.time,
      mode: eventData.mode,
      audience: eventData.audience,
      agenda: eventData.agenda,
      organizer: eventData.organizer,
      tags: eventData.tags,
    });

    return NextResponse.json(
      { message: "event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "event creation failed",
        error: e instanceof Error ? e.message : "unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json({ events }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "failed to fetch events",
        error: e instanceof Error ? e.message : "unknown error",
      },
      { status: 500 }
    );
  }
}
