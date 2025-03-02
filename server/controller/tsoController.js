import mongoSanitize from "mongo-sanitize";
import routeModel from "../models/routeModel.js";
import scheduleModel from "../models/scheduleModel.js";
import { custom_error_handler } from "../errorHandler/errorHandler.js";
import bookingModel from "../models/bookingModel.js";
import seatModel from "../models/seatModel.js";
import busModel from "../models/busModel.js";
import { sendBookingConfirmationEmail } from "../emailController.js";
import crypto from "crypto";
import { sendMessage } from "../sms.js";

function generateSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

//search
export const searchSchedules = async (req, res, next) => {
  try {
    const { from, to, date } = req.query;
    console.log(req.query);
    const query = {};

    if (from) {
      query.from = { $regex: new RegExp(from, "i") };
    }

    if (to) {
      query.to = { $regex: new RegExp(to, "i") };
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      query.schedule_date = { $gte: startDate, $lt: endDate };
    }

    const schedules = await scheduleModel.find(query);

    if (schedules.length === 0) {
      return res
        .status(404)
        .json({ message: "No schedules found matching the criteria." });
    }
    res.status(200).json(schedules);
  } catch (error) {
    next(error);
  }
};
export const listSchedules = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch the schedule by ID
    const schedule = await scheduleModel.findById(id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Get the `from` and `to` fields
    const { from, to } = schedule;

    // Find up to 5 schedules with the same `from` and `to` fields
    const relatedSchedules = await scheduleModel
      .find({ from, to, _id: { $ne: id } }) // Exclude the original schedule
      .limit(15);

    res.status(200).json(relatedSchedules);
  } catch (error) {
    next(error);
  }
};

//book
export const bookTicket = async (req, res, next) => {
  function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  try {
    const confirmationCode = crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase();
    console.log(req.body);
    const booking = bookingModel({
      ...req.body,
      confirmationCode,
    });

    const booked = await booking.save();
    if (!booked) {
      res.status(400).json({ msg: "Not Booked" });
    }
    const busDetail = await busModel.findById(booked?.busId);
    const scheduleDetail = await scheduleModel.findById(booked?.scheduleId);
    for (let i = 0; i < booked.passengers.length; i++) {
      let passenger = booked.passengers[i];
      if (passenger?.type === "adult") {
        await sendBookingConfirmationEmail(passenger.email, {
          passenger,
          booked,
          seat: booked.seats[i],
          busDetail,
          scheduleDetail,
        });

        const body = `
Booking Confirmation

Hi ${passenger?.first_name} ${
          passenger?.last_name
        }, your booking for a bus from ${scheduleDetail?.from} to ${
          scheduleDetail?.to
        } is confirmed!

Bus: ${busDetail?.license_plate}
Departure Date: ${formatDate(scheduleDetail?.schedule_date)}
Time: ${scheduleDetail?.departure_time}
Seat Number: ${booked.seats[i].seatNo}
Please arrive 15 minutes early.
Safe travels!
Habesha Bus
              `;
        await sendMessage(passenger.phone, body);
      }
    }
    res.status(200).json({ booked, msg: "booked succ" });
  } catch (error) {
    next(error);
  }
};
export const rescheduleBookTicket = async (req, res, next) => {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  try {
    const { id } = req.params;
    const booking = await bookingModel.findById(id);
    console.log(booking);
    if (!booking) {
      return res.status(400).json({ msg: "Not Found" }); // ✅ Fix: Added return to stop execution
    }
    const seatNumbers = booking.seats.map((seat) => seat.seatNo);

    // Delete seats from the database using seatNo and bookingId
    await seatModel.deleteMany({
      seat_no: { $in: seatNumbers },
      bookId: id,
    });

    console.log(req.body);

    const booked = await bookingModel.findByIdAndUpdate(
      id,
      {
        $set: { ...req.body },
      },
      { new: true }
    );

    const busDetail = await busModel.findById(booked?.busId);
    const scheduleDetail = await scheduleModel.findById(booked?.scheduleId);

    for (let i = 0; i < booked.passengers.length; i++) {
      let passenger = booked.passengers[i];

      if (passenger?.type === "adult") {
        await sendBookingConfirmationEmail(passenger.email, {
          passenger,
          booked,
          seat: booked.seats[i],
          busDetail,
          scheduleDetail,
        });

        const body = `
Booking Reschedule

Hi ${passenger?.first_name} ${
          passenger?.last_name
        }, your booking for a bus from ${scheduleDetail?.from} to ${
          scheduleDetail?.to
        } is confirmed!

Bus: ${busDetail?.license_plate}
Departure Date: ${formatDate(scheduleDetail?.schedule_date)}
Time: ${scheduleDetail?.departure_time}
Seat Number: ${booked.seats[i].seatNo}
Please arrive 15 minutes early.
Safe travels!
Habesha Bus
        `;

        await sendMessage(passenger.phone, body);
      }
    }

    res.status(200).json({ booked, msg: "Rescheduled successfully" });
  } catch (error) {
    next(error);
  }
};

export const addSeat = async (req, res, next) => {
  try {
    if (!Array.isArray(req.body)) {
      return res
        .status(400)
        .json({ msg: "Invalid data format. Expected an array." });
    }

    // Use `Promise.all` to save all objects in the array concurrently
    const savedSeats = await Promise.all(
      req.body.map(async (seatData) => {
        const seatInfo = new seatModel(seatData); // Create a new seat instance
        return seatInfo.save(); // Save to the database
      })
    );

    res.status(201).json({
      msg: "All seats added successfully",
      savedSeats,
    });
  } catch (error) {
    next(error);
  }
};

export const getSeats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bus_id } = req.query;
    const takenSeats = await seatModel.find({ scheduleId: id, bus_id });
    res.status(201).json(takenSeats);
  } catch (error) {
    next(error);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await bookingModel.findOne({ confirmationCode: id });
    const schedule = await scheduleModel.findById(booking?.scheduleId);
    res.status(201).json({ booking, schedule });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const CancelledBooking = await bookingModel.findByIdAndDelete(id);
    const CancelledSeats = await seatModel.deleteMany({ bookId: id });
    res.status(201).json({ msg: "Booking Cancelled" });
  } catch (error) {
    next(error);
  }
};

export const myBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const myBooking = await bookingModel.findOne({
      confirmationCode: id,
    });
    if (!myBooking) {
      return res.status(404).json({ msg: "not found" });
    }
    const schedule = await scheduleModel.findById(myBooking?.scheduleId);

    res.status(201).json({ myBooking, schedule });
  } catch (error) {
    next(error);
  }
};

export const myBookingDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const myBooking = await bookingModel.findById(id);
    if (!myBooking) {
      return res.status(404).json({ msg: "not found" });
    }
    const schedule = await scheduleModel.findById(myBooking?.scheduleId);
    const bus = await busModel.findById(myBooking?.busId);

    res.status(201).json({ myBooking, schedule, bus });
  } catch (error) {
    next(error);
  }
};

export const editBookingPassengerDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const myBooking = await bookingModel.findById(id);
    if (!myBooking) {
      return res.status(404).json({ msg: "not found" });
    }

    await bookingModel.findByIdAndUpdate(id, {
      $set: {
        passengers: req.body,
      },
    });

    res.status(201).json({ msg: "passenger info updated" });
  } catch (error) {
    next(error);
  }
};

export const editBookingSeatDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Array.isArray(req.body.data)) {
      return res
        .status(400)
        .json({ msg: "Invalid data format. Expected an array." });
    }
    const newSeats = req.body.data.map(({ _id, ...rest }) => rest);

    const myBooking = await bookingModel.findById(id);
    if (!myBooking) {
      return res.status(404).json({ msg: "not found" });
    }

    await Promise.all(
      myBooking.seats.map(async (s) => {
        return await seatModel.findOneAndDelete({
          seat_no: s.seatNo,
          bookId: myBooking?._id,
          scheduleId: myBooking?.scheduleId,
        });
      })
    );

    const savedSeats = await Promise.all(
      newSeats?.map(async (seatData) => {
        const seatInfo = new seatModel(seatData);
        return seatInfo.save();
      })
    );

    const updatedSeats = req.body.seats.map((seat, i) => ({
      ...seat,
      seat_id: savedSeats[i]._id,
    }));

    const newSeatsUpdate = updatedSeats.map(({ _id, ...rest }) => rest);

    await bookingModel.findByIdAndUpdate(id, {
      $set: {
        seats: newSeatsUpdate,
      },
    });

    res.status(201).json({ msg: "passenger info updated" });
  } catch (error) {
    next(error);
  }
};

//route controller
export const addRoute = async (req, res, next) => {
  try {
    const sanitizedData = mongoSanitize(req.body);
    const sixDigitNumber = generateSixDigitNumber();
    sanitizedData.route_id = sixDigitNumber;
    const newRoute = routeModel(sanitizedData);
    await newRoute.save();
    res.status(200).json({ msg: "new Route added" });
  } catch (error) {
    next(error);
  }
};

export const ViewRoute = async (req, res, next) => {
  const { id } = req.params;
  try {
    const route = await routeModel.findById(id);
    if (!route) return next(custom_error_handler(404, "Route not found"));
    res.status(200).json(route);
  } catch (error) {
    next(error);
  }
};

export const UpdateRoute = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sanitizedData = mongoSanitize(req.body);
    const route = await routeModel.findByIdAndUpdate(id, {
      $set: sanitizedData,
    });
    if (!route) return next(custom_error_handler(404, "Route not found"));
    res.status(200).json({ msg: "Route info updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteRoute = async (req, res, next) => {
  const { id } = req.params;
  try {
    const route = await routeModel.findByIdAndDelete(id);
    if (!route) return next(custom_error_handler(404, "Route not found"));
    res.status(200).json({ msg: "Route Removed" });
  } catch (error) {
    next(error);
  }
};
