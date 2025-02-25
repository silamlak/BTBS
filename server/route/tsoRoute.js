import express from "express";
import { verifyJWT } from "../middleware/verifyToken.js";
import {
  addSeat,
  bookTicket,
  cancelBooking,
  editBookingPassengerDetail,
  editBookingSeatDetail,
  getBooking,
  getSeats,
  myBooking,
  myBookingDetail,
  searchSchedules,
} from "../controller/tsoController.js";
const router = express.Router();

//booking
router.get("/search", searchSchedules);
router.post("/book", bookTicket);
router.post("/seat", addSeat);
router.get("/seat/:id", getSeats);
router.get("/booking/:id", getBooking);
router.delete("/booking/cancel/:id", cancelBooking);
router.get("/booking/my/:id", myBooking);
router.get("/booking/my-booking-detail/:id", myBookingDetail);
router.post(
  "/booking/my-booking/edit/passenger/:id",
  editBookingPassengerDetail
);
router.post("/booking/my-booking/edit/seat/:id", editBookingSeatDetail);

export default router;
