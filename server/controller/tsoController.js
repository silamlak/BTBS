import mongoSanitize from "mongo-sanitize";
import routeModel from "../models/routeModel.js";
import scheduleModel from "../models/scheduleModel.js";
import { custom_error_handler } from "../errorHandler/errorHandler.js";
import bookingModel from "../models/bookingModel.js";
import seatModel from "../models/seatModel.js";
import busModel from "../models/busModel.js";

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

//book
export const bookTicket = async (req, res, next) => {
  try {
    console.log(req.body);
    const booking = bookingModel(req.body);
    const booked = await booking.save();
    res.status(200).json({ booked, msg: "booked succ" });
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
    const booking = await bookingModel.findById(id);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const CancelledBooking = await bookingModel.findByIdAndUpdate(
      id,
      {
        $set: { status: "Cancelled" },
      },
      { new: true }
    );
    const CancelledSeats = await seatModel.updateMany(
      { bookId: id },
      { $set: { status: "Cancelled" } },
      { new: true }
    );
    res.status(201).json({ CancelledBooking, CancelledSeats });
  } catch (error) {
    next(error);
  }
};

export const myBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const myBooking = await bookingModel.findById(id);
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
