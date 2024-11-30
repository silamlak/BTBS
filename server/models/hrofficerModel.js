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
    // position: {
    //   type: String,
    //   required: true,
    // },
    // department: {
    //   type: String,
    //   required: true,
    // },
    hire_date: {
      type: Date,
      default: Date.now(),
    },
    salary: {
      type: String,
      required: true,
    },
    employment_status: {
      type: String,
      default: 'Active',
      enum: ["Active","Inactive"]
    },
    profile_picture_url: {
      type: Array,
      default: [],
      required: false,
    },
    id_url: {
      type: Array,
      // required: true,
      default: [],
    },
    education: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("HROfficer", HROfficerSchema);
