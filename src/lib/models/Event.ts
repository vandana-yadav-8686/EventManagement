import mongoose, { Schema, models, model } from "mongoose";

export interface IEvent {
  _id: mongoose.Types.ObjectId;
  eventName: string;
  eventDate: Date;
  speakerName: string;
  speakerDesignation: string;
  description?: string;
  speakerIntro?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    eventName: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
      maxlength: 150,
    },
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    speakerName: {
      type: String,
      required: [true, "Speaker name is required"],
      trim: true,
      maxlength: 120,
    },
    speakerDesignation: {
      type: String,
      required: [true, "Speaker designation is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    speakerIntro: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.index({ eventDate: -1 });

export const Event =
  models.Event || model<IEvent>("Event", EventSchema);

export type EventLike = {
  _id: { toString(): string };
  eventName: string;
  eventDate: Date;
  speakerName: string;
  speakerDesignation: string;
  description?: string;
  speakerIntro?: string;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeEvent(event: EventLike) {
  return {
    id: event._id.toString(),
    eventName: event.eventName,
    eventDate: event.eventDate.toISOString(),
    eventDateFormatted: event.eventDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    speakerName: event.speakerName,
    speakerDesignation: event.speakerDesignation,
    description: event.description ?? "",
    speakerIntro: event.speakerIntro ?? "",
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}

export type SerializedEvent = ReturnType<typeof serializeEvent>;
