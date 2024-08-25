import express from "express";
import {
  deleteHROfficer,
  HROfficer,
  UpdateHROfficer,
  UpdateHROfficerPassword,
  ViewHROfficer,
} from "../controller/adminController.js";
import { verifyJWT } from "../middleware/verifyToken.js";
const router = express.Router();

//Hiring
router.post("/addhr", HROfficer);
router.get("/hr/get/:id", ViewHROfficer);
router.put("/hr/update/:id", UpdateHROfficer);
router.put("/hr/update/password/:id", UpdateHROfficerPassword);
router.delete("/hr/delete/:id", deleteHROfficer);

export default router;
