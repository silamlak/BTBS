import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema(
  {
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
    profile_picture_url: {
      type: String,
      // required: false,
    },
    license_picture_url: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Driver", DriverSchema);
