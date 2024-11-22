import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
  {
    schedule_id: {
      type: String,
      required: true,
      unique: true,
    },
    route_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    bus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    schedule_date: {
      type: Date,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    departure_time: {
      type: Date,
      required: true,
    },
    arrival_time: {
      type: Date,
      required: true,
    },
    ticket_price: {
      type: Number,
      required: true,
    },
    available_seats: {
      type: Number,
      // required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "Delayed"],
      default: "Scheduled",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Schedule", ScheduleSchema);
