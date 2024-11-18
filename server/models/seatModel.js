import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    seat_no: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Seat", seatSchema);
