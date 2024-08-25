import mongoSanitize from "mongo-sanitize";
import routeModel from "../models/routeModel.js";
import scheduleModel from "../models/scheduleModel.js";
import { custom_error_handler } from "../errorHandler/errorHandler.js";

function generateSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

//search
export const searchSchedules = async (req, res, next) => {
  try {
    const { from, to, date } = req.query;
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
