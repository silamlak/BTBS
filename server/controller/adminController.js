import mongoSanitize from "mongo-sanitize";
import hrofficerModel from "../models/hrofficerModel.js";
import bcrypt from "bcryptjs";
import { custom_error_handler } from "../errorHandler/errorHandler.js";

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
