import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    father_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    ethPhone: {
      type: String,
      required: true,
    },
    total_price: {
      type: Number,
      default: 0
      // required: true,
    },
    password: {
      type: String,
      required: true,
    },
    login_status: {
      type: Boolean,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      // This field will store the OTP value
    },
    otpExpires: {
      type: Date,
      // This field will store the expiration time of the OTP
    },
    resetToken: {
      type: String,
      // This field will store the OTP value
    },
    resetTokenExpires: {
      type: Date,
      // This field will store the expiration time of the OTP
    },
  },
  { timestamps: true }
);

// userSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 60 });

export default mongoose.model("Users", userSchema);
