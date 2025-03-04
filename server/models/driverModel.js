import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema(
  {
    bus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
    },
    first_name: {
      type: String,
      required: true,
    },
    middle_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    taken: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    hire_date: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: Number,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
    },
    employment_status: {
      type: String,
      required: true,
      enum: ["active", "Inactive", "Suspended"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Driver", DriverSchema);
