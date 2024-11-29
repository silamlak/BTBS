import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cron from "node-cron";

import authRoute from "./route/authRoute.js";
import adminRoute from './route/adminRoute.js'
import hrRoute from './route/hrRoute.js'
import boRoute from "./route/boRoute.js";
import tsoRoute from "./route/tsoRoute.js";
import userModel from "./models/userModel.js";

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://10.10.34.80:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(bodyParser.json());
dotenv.config();
app.use("/files", express.static("files"));
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/hr", hrRoute);
app.use("/api/bo", boRoute);
app.use("/api/tso", tsoRoute);

// cron.schedule("* * * * *", async () => {
//   const now = new Date();
//   try {
//     const result = await userModel.updateMany(
//       { otpExpires: { $lt: now } },
//       { $unset: { otp: "", otpExpires: "" } }
//     );
//     // console.log(`OTP fields cleared for ${result.email} users`);
//   } catch (error) {
//     console.error("Error clearing OTP fields:", error);
//   }
// });

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "server error";
  res.status(status).json({
    status: false,
    message: message,
  });
  next();
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  mongoose
    .connect(process.env.MONGODB)
    .then(() => console.log("db connected"))
    .catch((err) => console.log(err));
});

