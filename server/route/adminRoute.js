import express from "express";
import {
  deleteHROfficer,
  getHr,
  HROfficer,
  UpdateHROfficer,
  UpdateHROfficerPassword,
  ViewHROfficer,
} from "../controller/adminController.js";
import { verifyJWT } from "../middleware/verifyToken.js";
const router = express.Router();

//Hiring
router.post("/addhr", HROfficer);
router.get("/hr/get", getHr);
router.get("/hr/get/:id", ViewHROfficer);
router.post("/hr/update/:id", UpdateHROfficer);
router.post("/hr/update/password/:id", UpdateHROfficerPassword);
router.delete("/hr/delete/:id", deleteHROfficer);

export default router;
