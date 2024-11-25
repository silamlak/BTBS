import mongoSanitize from "mongo-sanitize";
import boofficerModel from "../models/boofficerModel.js";
import bcrypt from "bcryptjs";
import { custom_error_handler } from "../errorHandler/errorHandler.js";
import driverModel from "../models/driverModel.js";
import busModel from "../models/busModel.js";
import TicketSalesOfficerModel from "../models/TicketSalesOfficer.js";
import scheduleModel from "../models/scheduleModel.js";

//Hiring bus operator
export const BOOfficer = async (req, res, next) => {
  try {
    const duplicateBo = await boofficerModel.findOne({ email: req.body.email });
    if (duplicateBo)
      return next(custom_error_handler(409, "Email already exist"));
    const sanitizedData = mongoSanitize(req.body);
    const salt = await bcrypt.genSalt(10);
    sanitizedData.password = await bcrypt.hash(sanitizedData.password, salt);
    const newBOOfficer = boofficerModel(sanitizedData);
    await newBOOfficer.save();
    res.status(200).json({ msg: "new bus operator added" });
  } catch (error) {
    next(error);
  }
};

export const ViewHBOfficer = async (req, res, next) => {
  const { id } = req.params;
  try {
    const Bo = await boofficerModel.findById(id);
    if (!Bo) return next(custom_error_handler(404, "Bus Operator not found"));
    res.status(200).json(Bo);
  } catch (error) {
    next(error);
  }
};

export const getHBOfficer = async (req, res, next) => {
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
    const Bo = await boofficerModel.find(query).skip(skip).limit(limit);
    const totalCount = await boofficerModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    if (!Bo) return next(custom_error_handler(404, "Bus Operators not found"));
    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      Bo,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateBOOfficer = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sanitizedData = mongoSanitize(req.body);
    const Bo = await boofficerModel.findByIdAndUpdate(
      id,
      {
        $set: sanitizedData,
      },
      { new: true }
    );
    if (!Bo) return next(custom_error_handler(404, "Bus Operator not found"));
    res.status(200).json({ msg: "Bus Operator info updated", Bo });
  } catch (error) {
    next(error);
  }
};

export const UpdateBOOfficerPassword = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sanitizedData = mongoSanitize(req.body);
    const salt = await bcrypt.genSalt(10);
    sanitizedData.password = await bcrypt.hash(sanitizedData.password, salt);
    const Bo = await boofficerModel.findByIdAndUpdate(id, {
      $set: { password: sanitizedData.password },
    });
    if (!Bo) return next(custom_error_handler(404, "Bus Operator not found"));
    res.status(200).json({ msg: "Bus Operator password updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteBOOfficer = async (req, res, next) => {
  const { id } = req.params;
  try {
    const Bo = await boofficerModel.findByIdAndDelete(id);
    if (!Bo) return next(custom_error_handler(404, "Bus Operator not found"));
    res.status(200).json({ msg: "Bus Operator Removed" });
  } catch (error) {
    next(error);
  }
};

//bus controller
export const addBus = async (req, res, next) => {
  try {
    const sanitizedData = mongoSanitize(req.body);
    const newBus = busModel(sanitizedData);
    const bus = await newBus.save();
    await driverModel.findByIdAndUpdate(
      { _id: req.body.driver_id },
      { $set: { taken: true, bus_id: bus._id } },
      { new: true }
    );
    res.status(200).json({ msg: "new bus added" });
  } catch (error) {
    next(error);
  }
};

export const getBuses = async (req, res, next) => {
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
    const buses = await busModel.find(query).skip(skip).limit(limit);
    const totalCount = await busModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    if (!buses) return next(custom_error_handler(404, "Buses not found"));
    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      buses,
    });
  } catch (error) {
    next(error);
  }
};

export const getBusesList = async (req, res, next) => {
  try {
    const buses = await busModel.find({ taken: false });
    if (!buses) return next(custom_error_handler(404, "buses not found"));
    res.status(200).json(buses);
  } catch (error) {
    next(error);
  }
};

export const getRouteBusesList = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, from, to } = req.query;

    const givenDate = new Date(date);

    const dayBefore = new Date(givenDate);
    dayBefore.setDate(givenDate.getDate() - 1);

    const dayAfter = new Date(givenDate);
    dayAfter.setDate(givenDate.getDate() + 1);
    const todaySchedule = await scheduleModel.findOne({
      route_id: id,
      from: { $regex: new RegExp(`^${from}$`, "i") },
      to: { $regex: new RegExp(`^${to}$`, "i") },
      schedule_date: givenDate,
    });
    if (todaySchedule)
      return next(custom_error_handler(403, "Schedule already added"));
    const buses = await busModel.find({ route_id: id });
    if (!buses) return next(custom_error_handler(404, "buses not found"));
    const theDayBeforeschedule = await scheduleModel.findOne({
      route_id: id,
      to: { $regex: new RegExp(`^${from}$`, "i") },
      schedule_date: dayBefore,
    });
    const theDayAfterschedule = await scheduleModel.findOne({
      route_id: id,
      to: { $regex: new RegExp(`^${to}$`, "i") },
      schedule_date: dayAfter,
    });
    const dayBeforeBusIds = theDayBeforeschedule
      ? theDayBeforeschedule.bus_id
      : [];
    const dayAfterBusIds = theDayAfterschedule
      ? theDayAfterschedule.bus_id
      : [];
    const filteredBuses = buses.filter(
      (bus) =>
        dayBeforeBusIds.includes(bus._id) && !dayAfterBusIds.includes(bus._id)
    );
    console.log(filteredBuses);
    res.status(200).json(filteredBuses);
  } catch (error) {
    next(error);
  }
};

export const ViewBus = async (req, res, next) => {
  const { id } = req.params;
  try {
    const Bus = await busModel.findById(id);
    if (!Bus) return next(custom_error_handler(404, "Bus not found"));
    res.status(200).json(Bus);
  } catch (error) {
    next(error);
  }
};

export const UpdateBus = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sanitizedData = mongoSanitize(req.body);
    const Bus = await busModel.findByIdAndUpdate(
      id,
      {
        $set: sanitizedData,
      },
      { new: true }
    );
    if (!Bus) return next(custom_error_handler(404, "Bus not found"));
    res.status(200).json({ Bus, msg: "Bus info updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteBus = async (req, res, next) => {
  const { id } = req.params;
  try {
    const Bus = await busModel.findByIdAndDelete(id);
    if (!Bus) return next(custom_error_handler(404, "Bus not found"));
    res.status(200).json({ msg: "Bus Removed" });
  } catch (error) {
    next(error);
  }
};

//drivers
export const addDriver = async (req, res, next) => {
  try {
    const duplicateDriver = await driverModel.findOne({
      email: req.body.email,
    });
    if (duplicateDriver)
      return next(custom_error_handler(409, "Email already exist"));
    const sanitizedData = mongoSanitize(req.body);
    const salt = await bcrypt.genSalt(10);
    sanitizedData.password = await bcrypt.hash(sanitizedData.password, salt);
    const newDriver = driverModel(sanitizedData);
    await newDriver.save();
    res.status(200).json({ msg: "new bus driver added" });
  } catch (error) {
    next(error);
  }
};

export const getDrivers = async (req, res, next) => {
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
    const drivers = await driverModel.find(query).skip(skip).limit(limit);
    const totalCount = await driverModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    if (!drivers) return next(custom_error_handler(404, "Drivers not found"));
    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      drivers,
    });
  } catch (error) {
    next(error);
  }
};

export const getDriversList = async (req, res, next) => {
  try {
    const drivers = await driverModel.find({ taken: false });
    // console.log(object)
    if (!drivers) return next(custom_error_handler(404, "Drivers not found"));
    res.status(200).json(drivers);
  } catch (error) {
    next(error);
  }
};

export const ViewDriver = async (req, res, next) => {
  const { id } = req.params;
  try {
    const driver = await driverModel.findById(id);
    if (!driver) return next(custom_error_handler(404, "Driver not found"));
    res.status(200).json(driver);
  } catch (error) {
    next(error);
  }
};

export const UpdateDriver = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sanitizedData = mongoSanitize(req.body);
    const driver = await driverModel.findByIdAndUpdate(
      id,
      {
        $set: sanitizedData,
      },
      { new: true }
    );
    if (!driver) return next(custom_error_handler(404, "Driver not found"));
    res.status(200).json({ driver, msg: "Driver info updated" });
  } catch (error) {
    next(error);
  }
};

export const UpdateDriverPassword = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sanitizedData = mongoSanitize(req.body);
    const salt = await bcrypt.genSalt(10);
    sanitizedData.password = await bcrypt.hash(sanitizedData.password, salt);
    const driver = await driverModel.findByIdAndUpdate(id, {
      $set: { password: sanitizedData.password },
    });
    if (!driver) return next(custom_error_handler(404, "Driver not found"));
    res.status(200).json({ msg: "Driver password updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteDriver = async (req, res, next) => {
  const { id } = req.params;
  try {
    const driver = await driverModel.findByIdAndDelete(id);
    if (!driver) return next(custom_error_handler(404, "Driver not found"));
    res.status(200).json({ msg: "Driver Removed" });
  } catch (error) {
    next(error);
  }
};

//ticket sells officer
export const addTso = async (req, res, next) => {
  try {
    const duplicateTso = await TicketSalesOfficerModel.findOne({
      email: req.body.email,
    });
    if (duplicateTso)
      return next(custom_error_handler(409, "Email already exist"));
    const sanitizedData = mongoSanitize(req.body);
    const salt = await bcrypt.genSalt(10);
    sanitizedData.password = await bcrypt.hash(sanitizedData.password, salt);
    const newTso = TicketSalesOfficerModel(sanitizedData);
    await newTso.save();
    res.status(200).json({ msg: "new ticket sells officer added" });
  } catch (error) {
    next(error);
  }
};

export const getTso = async (req, res, next) => {
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
    const tso = await TicketSalesOfficerModel.find(query)
      .skip(skip)
      .limit(limit);
    const totalCount = await TicketSalesOfficerModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    if (!tso) return next(custom_error_handler(404, "Buses not found"));
    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      tso,
    });
  } catch (error) {
    next(error);
  }
};

export const getTsoList = async (req, res, next) => {
  try {
    const tsos = await TicketSalesOfficerModel.find({ taken: false });
    if (!tsos) return next(custom_error_handler(404, "Tsos not found"));
    res.status(200).json(tsos);
  } catch (error) {
    next(error);
  }
};

export const ViewTso = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tso = await TicketSalesOfficerModel.findById(id);
    if (!tso)
      return next(custom_error_handler(404, "Ticket Sells Officer not found"));
    res.status(200).json(tso);
  } catch (error) {
    next(error);
  }
};

export const UpdateTso = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sanitizedData = mongoSanitize(req.body);
    const tso = await TicketSalesOfficerModel.findByIdAndUpdate(
      id,
      {
        $set: sanitizedData,
      },
      { new: true }
    );
    if (!tso)
      return next(custom_error_handler(404, "Ticket Sells Officer not found"));
    res.status(200).json({ tso, msg: "Ticket Sells Officer info updated" });
  } catch (error) {
    next(error);
  }
};

export const UpdateTsoPassword = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sanitizedData = mongoSanitize(req.body);
    const salt = await bcrypt.genSalt(10);
    sanitizedData.password = await bcrypt.hash(sanitizedData.password, salt);
    const tso = await TicketSalesOfficerModel.findByIdAndUpdate(id, {
      $set: { password: sanitizedData.password },
    });
    if (!tso)
      return next(custom_error_handler(404, "Ticket Sells Officer not found"));
    res.status(200).json({ msg: "Ticket Sells Officer password updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteTso = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tso = await TicketSalesOfficerModel.findByIdAndDelete(id);
    if (!tso)
      return next(custom_error_handler(404, "Ticket Sells Officer not found"));
    res.status(200).json({ msg: "Ticket Sells Officer Removed" });
  } catch (error) {
    next(error);
  }
};
