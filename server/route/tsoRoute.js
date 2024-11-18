import express from "express";
import { verifyJWT } from "../middleware/verifyToken.js";
import { addSeat, bookTicket, cancelBooking, getBooking, getSeats, searchSchedules } from "../controller/tsoController.js";
const router = express.Router();

//booking
router.get("/search", searchSchedules);
router.post("/book", bookTicket);
router.post("/seat", addSeat);
router.get("/seat/:id", getSeats);
router.get("/booking/:id", getBooking);
router.get("/booking/cancel/:id", cancelBooking);

export default router;
