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
import axios from "axios";
import moment from "moment";

import authRoute from "./route/authRoute.js";
import adminRoute from "./route/adminRoute.js";
import hrRoute from "./route/hrRoute.js";
import boRoute from "./route/boRoute.js";
import tsoRoute from "./route/tsoRoute.js";
import userModel from "./models/userModel.js";
import scheduleModel from "./models/scheduleModel.js";
import bookingModel from "./models/bookingModel.js";

import { sendMessage } from "./sms.js";

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://10.10.34.224:3000", "http://localhost:5173"],
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

app.post("/accept-payment", async (req, res) => {
  const {
    amount,
    currency,
    email,
    first_name,
    last_name,
    phone_number,
    tx_ref,
  } = req.body;

  try {
    const header = {
      headers: {
        Authorization: `Bearer CHASECK_TEST-ukEdqeZxC1WAldpYM4zWoVFGucoJbDwp`,
        "Content-Type": "application/json",
      },
    };
    const body = {
      amount: amount,
      currency: currency,
      email: email,
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      tx_ref: tx_ref,
      return_url: "http://10.10.34.68/payment", // Set your return URL
    };
    let resp = "";
    await axios
      .post("https://api.chapa.co/v1/transaction/initialize", body, header)
      .then((response) => {
        resp = response;
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        res.status(400).json({
          message: error,
        });
      });
    res.status(200).json(resp.data);
  } catch (e) {
    res.status(400).json({
      error_code: e.code,
      message: e.message,
    });
  }
});

cron.schedule("* * * * *", async () => {
  const now = new Date();
  function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  try {
    const tomorrowStart = moment().add(1, "days").startOf("day").toDate();
    const tomorrowEnd = moment().add(1, "days").endOf("day").toDate();

    const schedules = await scheduleModel.find({
      schedule_date: { $gte: tomorrowStart, $lte: tomorrowEnd },
    });

    const scheduleIds = schedules.map((schedule) => schedule._id);

    const bookings = await bookingModel.find({
      scheduleId: { $in: scheduleIds },
      notify: false,
    });

    bookings?.forEach(async (booking) => {
      await bookingModel.findByIdAndUpdate(booking._id, {
        $set: { notify: true },
      });
      booking.passengers?.forEach(async (pass) => {
        const schedule = await scheduleModel.findById(booking.scheduleId);
        console.log(schedule);
        const body = `
      Booking Reminder

Hi ${pass?.first_name} ${pass?.last_name}, your bus to ${
          schedule?.to
        } departs on ${formatDate(schedule?.schedule_date)} at ${
          schedule?.departure_time
        }.

Safe travels!
Habesha Bus
      `;
        await sendMessage(pass.phone, body);
      });
    });

    console.log(bookings);
  } catch (err) {
    console.error("Error:", err);
  }
});

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
    .then(() => console.log("db"))
    .catch((err) => console.log(err));
});
