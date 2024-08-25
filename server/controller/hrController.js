import mongoSanitize from "mongo-sanitize";
import boofficerModel from "../models/boofficerModel.js";
import bcrypt from "bcryptjs";
import { custom_error_handler } from "../errorHandler/errorHandler.js";
import driverModel from "../models/driverModel.js";
import busModel from "../models/busModel.js";
import TicketSalesOfficerModel from "../models/TicketSalesOfficer.js";

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
    const Bo = await boofficerModel.find();
    if (!Bo) return next(custom_error_handler(404, "Bus Operators not found"));
    res.status(200).json(Bo);
  } catch (error) {
    next(error);
  }
};

export const UpdateBOOfficer = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sanitizedData = mongoSanitize(req.body);
    const Bo = await boofficerModel.findByIdAndUpdate(id, {
      $set: sanitizedData,
    });
    if (!Bo) return next(custom_error_handler(404, "Bus Operator not found"));
    res.status(200).json({ msg: "Bus Operator info updated" });
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
    await newBus.save();
    res.status(200).json({ msg: "new bus added" });
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
    const Bus = await busModel.findByIdAndUpdate(id, {
      $set: sanitizedData,
    });
    if (!Bus) return next(custom_error_handler(404, "Bus not found"));
    res.status(200).json({ msg: "Bus info updated" });
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
    const duplicateDriver = await driverModel.findOne({ email: req.body.email });
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
    const driver = await driverModel.findByIdAndUpdate(id, {
      $set: sanitizedData,
    });
    if (!driver) return next(custom_error_handler(404, "Driver not found"));
    res.status(200).json({ msg: "Driver info updated" });
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

export const ViewTso = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tso = await TicketSalesOfficerModel.findById(id);
    if (!tso) return next(custom_error_handler(404, "Ticket Sells Officer not found"));
    res.status(200).json(tso);
  } catch (error) {
    next(error);
  }
};

export const UpdateTso = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sanitizedData = mongoSanitize(req.body);
    const tso = await TicketSalesOfficerModel.findByIdAndUpdate(id, {
      $set: sanitizedData,
    });
    if (!tso) return next(custom_error_handler(404, "Ticket Sells Officer not found"));
    res.status(200).json({ msg: "Ticket Sells Officer info updated" });
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
    if (!tso) return next(custom_error_handler(404, "Ticket Sells Officer not found"));
    res.status(200).json({ msg: "Ticket Sells Officer password updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteTso = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tso = await TicketSalesOfficerModel.findByIdAndDelete(id);
    if (!tso) return next(custom_error_handler(404, "Ticket Sells Officer not found"));
    res.status(200).json({ msg: "Ticket Sells Officer Removed" });
  } catch (error) {
    next(error);
  }
};
