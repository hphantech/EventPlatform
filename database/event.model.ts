import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // stored as YYYY-MM-DD
  time: string; // stored as HH:MM
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
    },
    image: { type: String, required: [true, "Image is required"], trim: true },
    venue: { type: String, required: [true, "Venue is required"], trim: true },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: { type: String, required: [true, "Date is required"], trim: true },
    time: { type: String, required: [true, "Time is required"], trim: true },
    mode: { type: String, required: [true, "Mode is required"], trim: true },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "Agenda must contain at least one item",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "Tags must contain at least one item",
      },
    },
  },
  { timestamps: true }
);

// Unique index on slug
EventSchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-save hook (ASYNC style, no "next" callback)
 * - Generates slug from title (only if title changed)
 * - Normalizes date to YYYY-MM-DD
 * - Validates time as HH:MM
 */
EventSchema.pre("save", async function () {
  const event = this as IEvent;

  // Slug
  if (event.isModified("title")) {
    event.slug = event.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Date normalize -> YYYY-MM-DD
  if (event.isModified("date")) {
    const parsedDate = new Date(event.date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date format");
    }
    event.date = parsedDate.toISOString().split("T")[0];
  }

  // Time validate HH:MM
  if (event.isModified("time")) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(event.time)) {
      throw new Error("Time must be in HH:MM format");
    }
  }
});

// Prevent model recompilation in dev hot reload
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
