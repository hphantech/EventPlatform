import mongoose, { Document, Model, Schema } from "mongoose";
import Event from "./event.model";

export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(v);
        },
        message: "Invalid email format",
      },
    },
  },
  { timestamps: true }
);

BookingSchema.index({ eventId: 1 });

/**
 * Pre-save hook (ASYNC style, no "next")
 * Validates the referenced event exists.
 */
BookingSchema.pre("save", async function () {
  const booking = this as IBooking;

  if (booking.isModified("eventId")) {
    const eventExists = await Event.exists({ _id: booking.eventId });
    if (!eventExists) {
      throw new Error("Referenced event does not exist");
    }
  }
});

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
