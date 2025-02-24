import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    father_name: {
      type: String,
      required: [true, "Father name is required"],
      trim: true,
    },
    ethPhone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^09\d{8}$/, "Invalid Ethiopian phone number"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
  },
  { timestamps: true } 
);

export default mongoose.model("Admin", adminSchema);
