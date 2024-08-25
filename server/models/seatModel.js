import mongoose from "mongoose";

const SeatSchema = new mongoose.Schema(
  {
    schedule_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    seat_number: {
      type: String,
      required: true,
    },
    is_available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Seat", SeatSchema);
