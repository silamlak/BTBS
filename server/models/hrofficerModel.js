import mongoose from "mongoose";

const HROfficerSchema = new mongoose.Schema(
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
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    hire_date: {
      type: Date,
      default: Date.now(),
    },
    salary: {
      type: String,
      required: true,
    },
    address: {
      street: String,
      city: String,
    },
    employment_status: {
      type: String,
      required: true,
    },
    profile_picture_url: {
      type: String,
      required: false,
    },
    id_url: {
      type: Array,
      required: true,
    },
    education: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("HROfficer", HROfficerSchema);
