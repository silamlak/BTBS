import express from "express";
import {
  deleteHROfficer,
  getBookingChartData,
  getHr,
  getTotalCount,
  HROfficer,
  totalPricePerSchedule,
  UpdateHROfficer,
  UpdateHROfficerPassword,
  ViewHROfficer,
} from "../controller/adminController.js";
import { verifyJWT } from "../middleware/verifyToken.js";
const router = express.Router();


//dashboard
router.get("/dashboard/get", getTotalCount);
router.get("/dashboard/get/radar", totalPricePerSchedule);
router.get("/dashboard/get/chart", getBookingChartData);


//Hiring
router.post("/addhr", HROfficer);
router.get("/hr/get", getHr);
router.get("/hr/get/:id", ViewHROfficer);
router.post("/hr/update/:id", UpdateHROfficer);
router.post("/hr/update/password/:id", UpdateHROfficerPassword);
router.delete("/hr/delete/:id", deleteHROfficer);

export default router;
