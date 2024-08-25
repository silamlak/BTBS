import express from "express";
import { verifyJWT } from "../middleware/verifyToken.js";
import { searchSchedules } from "../controller/tsoController.js";
const router = express.Router();

//booking
router.get("/search", searchSchedules);

export default router;
