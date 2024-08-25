import express from "express";
import {
  addBus,
  addDriver,
  addTso,
  BOOfficer,
  deleteBOOfficer,
  deleteBus,
  deleteDriver,
  deleteTso,
  UpdateBOOfficer,
  UpdateBOOfficerPassword,
  UpdateBus,
  UpdateDriver,
  UpdateDriverPassword,
  UpdateTso,
  UpdateTsoPassword,
  ViewBus,
  ViewDriver,
  ViewHBOfficer,
  ViewTso,
} from "../controller/hrController.js";
import { verifyJWT } from "../middleware/verifyToken.js";
const router = express.Router();

//Hiring

//bus operator
router.post("/addbo", BOOfficer);
router.get("/bo/get/:id", ViewHBOfficer);
router.put("/bo/update/:id", UpdateBOOfficer);
router.put("/bo/update/password/:id", UpdateBOOfficerPassword);
router.delete("/bo/delete/:id", deleteBOOfficer);

//ticket sells officer
router.post("/adddtso", addTso);
router.get("/tso/get/:id", ViewTso);
router.put("/tso/update/:id", UpdateTso);
router.put("/tso/update/password/:id", UpdateTsoPassword);
router.delete("/tso/delete/:id", deleteTso);

//driver
router.post("/adddriver", addDriver);
router.get("/driver/get/:id", ViewDriver);
router.put("/driver/update/:id", UpdateDriver);
router.put("/driver/update/password/:id", UpdateDriverPassword);
router.delete("/driver/delete/:id", deleteDriver);

//bus
router.post("/addbus", addBus);
router.get("/bus/get/:id", ViewBus);
router.put("/bus/update/:id", UpdateBus);
router.delete("/bus/delete/:id", deleteBus);

export default router;
