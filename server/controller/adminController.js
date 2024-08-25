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
  try {
    const sanitizedData = mongoSanitize(req.body);
    const Hr = await hrofficerModel.findByIdAndUpdate(id, {
      $set: sanitizedData,
    });
    if (!Hr) return next(custom_error_handler(404, "HR not found"));
    res.status(200).json({ msg: "HR info updated" });
  } catch (error) {
    next(error);
  }
};

export const UpdateHROfficerPassword = async (req, res, next) => {
  const { id } = req.params;
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
    const Hr = await hrofficerModel.findByIdAndDelete(id);
    if (!Hr) return next(custom_error_handler(404, "HR not found"));
    res.status(200).json({ msg: "HR Removed" });
  } catch (error) {
    next(error);
  }
};

// catagories
// export const getCatagorie = async (req, res, next) => {
//   try {
//     const catagorie = await catagorieModel.find().sort({createdAt: -1})
//     if (!catagorie) return res.status(400).json({ msg: "No Catagorie Found" });
//     res.status(200).json(catagorie);
//   } catch (error) {
//     next(error);
//   }
// };

// export const ViewCatagorie = async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const catagorie = await catagorieModel.findById(id);
//     if (!catagorie) return res.status(400).json({ msg: "Catagorie Not Found" });
//     const services = await serviceModel.find({ category: catagorie.title });
//     const all = {
//       ...catagorie._doc,
//       services: services,
//     };
//     res.status(200).json({ catagorie, services });
//   } catch (error) {
//     next(error);
//   }
// };

// export const addCatagorie = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const sanitizedData = mongoSanitize(req.body);

//     const newCatagorie = catagorieModel(sanitizedData);

//     await newCatagorie.save();
//     res.status(201).json({ msg: "New Catagorie Created", newCatagorie });
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateCatagorie = async (req, res, next) => {
//   const { id } = req.params;
//   const updatedData = req.body;
//   try {
//     const sanitizedData = mongoSanitize(updatedData);
//     const updatedCatagorie = await catagorieModel.findByIdAndUpdate(
//       id,
//       {
//         $set: sanitizedData,
//       },
//       { new: true }
//     );
//     if (!updatedCatagorie) {
//       return res.status(400).json({ msg: "Catagorie Not Found" });
//     }
//     res.status(200).json({ msg: "Catagorie Updated", updatedCatagorie });
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteCatagorie = async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const deletedCatagorie = await catagorieModel.findByIdAndDelete(id);
//     if (!deletedCatagorie)
//       return res.status(400).json({ msg: "Catagorie Not Found" });
//     res.status(200).json({ msg: "Catagorie Deleted" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const deletePurchased = async (req, res, next) => {
//   try {
//     const ids = req.body.ids
//     console.log(ids);
//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({ msg: "No IDs provided" });
//     }
//     const result = await purchasedModel.deleteMany({ _id: { $in: ids } });
//     if (result.deletedCount === 0) {
//       return res.status(404).json({ msg: "No files found to delete" });
//     }
//     res.status(200).json({
//       msg: "Files deleted successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getCustomers = async (req, res, next) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const search = req.query.search || "";
//     // const category = req.query.category || "Pending";
//     const date = req.query.date ? new Date(req.query.date) : null;
//     const minPrice = parseFloat(req.query.minPrice) || null;

//     const skip = (page - 1) * limit;

//     let query = {};
//     if (date) {
//       // Create a date range for the entire day
//       const startOfDay = new Date(date.setHours(0, 0, 0, 0));
//       const endOfDay = new Date(date.setHours(23, 59, 59, 999));

//       query.createdAt = {
//         $gte: startOfDay,
//         $lte: endOfDay,
//       };
//     }

//     if (minPrice !== null) {
//       query.total_price = { $gte: minPrice };
//     }
// console.log(search)
//     if (search) {
//       query.first_name = { $regex: search, $options: "i" };
//     }
//     // if (search) {
//     //   query.father_name = { $regex: search, $options: "i" };
//     // }
//     // if (search) {
//     //   query.email = { $regex: search, $options: "i" };
//     // }

//     // if (category) {
//     //   query.status = category;
//     // }
//     const users = await userModel.find(query).skip(skip).limit(limit);
//     const totalCount = await userModel.countDocuments(query);
//     const totalPages = Math.ceil(totalCount / limit);

//     if (!users) return res.status(400).json({ msg: "No Customer Found" });
//     res.status(200).json({
//       currentPage: page,
//       totalPages: totalPages,
//       totalCount: totalCount,
//       users,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
