import mongoSanitize from "mongo-sanitize";
import routeModel from "../models/routeModel.js";
import stationPlaceModel from "../models/stationModel.js";
import scheduleModel from "../models/scheduleModel.js";
import { custom_error_handler } from "../errorHandler/errorHandler.js";

function generateSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

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

//place controller
export const addPlace = async (req, res, next) => {
  try {
    const sanitizedData = mongoSanitize(req.body);
    const newPlace = stationPlaceModel(sanitizedData);
    await newPlace.save();
    res.status(200).json({ msg: "new StationPlace added" });
  } catch (error) {
    next(error);
  }
};

export const getStations = async (req, res, next) => {
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
      query.name = { $regex: search, $options: "i" };
    }
    const stations = await stationPlaceModel.find(query).skip(skip).limit(limit);
    const totalCount = await stationPlaceModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    if (!stations) return next(custom_error_handler(404, "Stations not found"));
    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      stations,
    });
  } catch (error) {
    next(error);
  }
};

export const ViewPlace = async (req, res, next) => {
  const { id } = req.params;
  try {
    const place = await stationPlaceModel.findById(id);
    if (!place)
      return next(custom_error_handler(404, "StationPlace not found"));
    res.status(200).json(place);
  } catch (error) {
    next(error);
  }
};

export const UpdatePlace = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sanitizedData = mongoSanitize(req.body);
    const place = await stationPlaceModel.findByIdAndUpdate(id, {
      $set: sanitizedData,
    });
    if (!place)
      return next(custom_error_handler(404, "StationPlace not found"));
    res.status(200).json({ msg: "StationPlace info updated" });
  } catch (error) {
    next(error);
  }
};

export const deletePlace = async (req, res, next) => {
  const { id } = req.params;
  try {
    const place = await stationPlaceModel.findByIdAndDelete(id);
    if (!place)
      return next(custom_error_handler(404, "StationPlace not found"));
    res.status(200).json({ msg: "StationPlace Removed" });
  } catch (error) {
    next(error);
  }
};

//schedule controller
export const addSchedule = async (req, res, next) => {
  try {
    const sanitizedData = mongoSanitize(req.body);
    const sixDigitNumber = generateSixDigitNumber();
    sanitizedData.schedule_id = sixDigitNumber;
    const newSchedule = scheduleModel(sanitizedData);
    await newSchedule.save();
    res.status(200).json({ msg: "new schedule added" });
  } catch (error) {
    next(error);
  }
};

export const ViewSchedule = async (req, res, next) => {
  const { id } = req.params;
  try {
    const Schedule = await scheduleModel.findById(id);
    if (!Schedule) return next(custom_error_handler(404, "Schedule not found"));
    res.status(200).json(Schedule);
  } catch (error) {
    next(error);
  }
};

export const UpdateSchedule = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sanitizedData = mongoSanitize(req.body);
    const Schedule = await scheduleModel.findByIdAndUpdate(id, {
      $set: sanitizedData,
    });
    if (!Schedule)
      return next(custom_error_handler(404, "Schedule not found"));
    res.status(200).json({ msg: "Schedule info updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteSchedule = async (req, res, next) => {
  const { id } = req.params;
  try {
    const Schedule = await scheduleModel.findByIdAndDelete(id);
    if (!Schedule)
      return next(custom_error_handler(404, "Schedule not found"));
    res.status(200).json({ msg: "Schedule Removed" });
  } catch (error) {
    next(error);
  }
};