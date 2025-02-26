import mongoSanitize from "mongo-sanitize";
import hrofficerModel from "../models/hrofficerModel.js";
import bcrypt from "bcryptjs";
import { custom_error_handler } from "../errorHandler/errorHandler.js";
import scheduleModel from "../models/scheduleModel.js";
import bookingModel from "../models/bookingModel.js";
import boofficerModel from "../models/boofficerModel.js";
import stationModel from "../models/stationModel.js";
import routeModel from "../models/routeModel.js";
import busModel from "../models/busModel.js";
import driverModel from "../models/driverModel.js";
import TicketSalesOfficerModel from "../models/TicketSalesOfficer.js";

//dashboard

export const getTotalCount = async (req, res) => {
  try {
    console.log("object");
    const boCount = await boofficerModel.countDocuments();
    const driverCount = await driverModel.countDocuments();
    const tsoCount = await TicketSalesOfficerModel.countDocuments();
    const busCount = await busModel.countDocuments();
    const scheduleCount = await scheduleModel.countDocuments();
    const routeCount = await routeModel.countDocuments();
    const stationCount = await stationModel.countDocuments();
    const hrCount = await hrofficerModel.countDocuments();
    res.status(200).json({
      totalBo: boCount,
      totalDriver: driverCount,
      totalTso: tsoCount,
      totalBus: busCount,
      totalSchedules: scheduleCount,
      totalRoutes: routeCount,
      totalStation: stationCount,
      totalHr: hrCount,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingChartData = async (req, res, next) => {
  try {
    // Fetch the total sales and total revenue by date
    const bookingData = await bookingModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by date
          totalSales: { $sum: 1 }, // Count the number of bookings (total sales)
          totalRevenue: { $sum: "$total_price" }, // Sum up total revenue
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date ascending
      },
      {
        $project: {
          date: "$_id", // Rename _id to date
          totalSales: 1,
          totalRevenue: 1,
          _id: 0, // Remove _id from the final output
        },
      },
    ]);

    // Send the result back to the client
    res.status(200).json(bookingData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const totalPricePerSchedule = async (req, res, next) => {
  try {
    const schedules = await scheduleModel.find();

    const schedulesWithTotalPrice = [];

    for (let schedule of schedules) {
      const bookingsExist = await bookingModel.findOne({
        scheduleId: schedule._id,
      });

      if (bookingsExist) {
        console.log(bookingsExist);
        const totalPrice = await bookingModel.aggregate([
          {
            $match: { scheduleId: schedule._id },
          },
          {
            $group: {
              _id: "$scheduleId",
              totalPrice: { $sum: "$total_price" },
            },
          },
          {
            $project: {
              _id: 0,
              scheduleId: "$_id",
              totalPrice: "$totalPrice",
            },
          },
        ]);

        schedulesWithTotalPrice.push({
          scheduleId: schedule.schedule_id,
          totalPrice: totalPrice.length > 0 ? totalPrice[0].totalPrice : 0,
        });
      } else {
        schedulesWithTotalPrice.push({
          scheduleId: schedule.schedule_id,
          totalPrice: 0,
        });
      }
    }

    res.status(200).json(schedulesWithTotalPrice);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

//Hiring
export const HROfficer = async (req, res, next) => {
  try {
    const duplicateHr = await hrofficerModel.findOne({ email: req.body.email });
    if (duplicateHr)
      return next(custom_error_handler(409, "Email already exist"));
    const sanitizedData = mongoSanitize(req.body);
    const salt = await bcrypt.genSalt(10);
    sanitizedData.password = await bcrypt.hash(sanitizedData.password, salt);
    const newHROfficer = hrofficerModel(sanitizedData);
    await newHROfficer.save();
    res.status(200).json({ msg: "new hr added" });
  } catch (error) {
    next(error);
  }
};

export const getHr = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const date = req.query.date ? new Date(get.query.date) : null;
    const skip = (page - 1) * limit;
    let query = {};
    if (date) {
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      query.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }
    if (search) {
      query.first_name = { $regex: search, $options: "i" };
    }
    const hr = await hrofficerModel.find(query).skip(skip).limit(limit);
    const totalCount = await hrofficerModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    if (!hr) return next(custom_error_handler(404, "Buses not found"));
    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      hr,
    });
  } catch (error) {
    next(error);
  }
};

export const ViewHROfficer = async (req, res, next) => {
  const { id } = req.params;
  try {
    const Hr = await hrofficerModel.findById(id);
    if (!Hr) return next(custom_error_handler(404, "HR not found"));
    res.status(200).json(Hr);
  } catch (error) {
    next(error);
  }
};

export const UpdateHROfficer = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    const sanitizedData = mongoSanitize(req.body);
    const Hr = await hrofficerModel.findByIdAndUpdate(
      id,
      {
        $set: sanitizedData,
      },
      { new: true }
    );
    if (!Hr) return next(custom_error_handler(404, "HR not found"));
    res.status(200).json({ Hr, msg: "HR info updated" });
  } catch (error) {
    next(error);
  }
};

export const UpdateHROfficerPassword = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body);
  try {
    const sanitizedData = mongoSanitize(req.body);
    const salt = await bcrypt.genSalt(10);
    sanitizedData.password = await bcrypt.hash(sanitizedData.password, salt);
    const Hr = await hrofficerModel.findByIdAndUpdate(id, {
      $set: { password: sanitizedData.password },
    });
    if (!Hr) return next(custom_error_handler(404, "HR not found"));
    res.status(200).json({ msg: "HR password updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteHROfficer = async (req, res, next) => {
  const { id } = req.params;
  try {
    const Hr = await hrofficerModel.findById(id);
    if (!Hr) return next(custom_error_handler(404, "HR not found"));
    await hrofficerModel.findByIdAndDelete(id);
    res.status(200).json({ msg: "HR Removed" });
  } catch (error) {
    next(error);
  }
};
