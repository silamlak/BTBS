import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema(
  {
    route_id: {
      type: String,
      required: true,
      unique: true,
    },
    bus_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bus",
        required: false,
      },
    ],
    route_name: {
      type: String,
      required: true,
    },
    start_location: {
      type: String,
      required: true,
    },
    end_location: {
      type: String,
      required: true,
    },
    total_distance: {
      type: Number,
      required: true,
    },
    estimated_time: {
      type: Number,
      required: true,
    },
    stops: {
      stop_name: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
    },
    bidirectional: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Under Review"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Route", RouteSchema);
