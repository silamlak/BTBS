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
  getBuses,
  getBusesList,
  getDrivers,
  getDriversList,
  getHBOfficer,
  getRouteBusesList,
  getTso,
  getTsoList,
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
router.get("/bo/get", getHBOfficer);
router.post("/bo/update/:id", UpdateBOOfficer);
router.post("/bo/update/password/:id", UpdateBOOfficerPassword);
router.delete("/bo/delete/:id", deleteBOOfficer);

//ticket sells officer
router.post("/adddtso", addTso);
router.get("/tso/get_list", getTsoList);
router.get("/tso/get", getTso);
router.get("/tso/get/:id", ViewTso);
router.post("/tso/update/:id", UpdateTso);
router.post("/tso/update/password/:id", UpdateTsoPassword);
router.delete("/tso/delete/:id", deleteTso);

//driver
router.post("/adddriver", addDriver);
router.get("/driver/get_list", getDriversList);
router.get("/driver/get", getDrivers);
router.get("/driver/get/:id", ViewDriver);
router.post("/driver/update/:id", UpdateDriver);
router.post("/driver/update/password/:id", UpdateDriverPassword);
router.delete("/driver/delete/:id", deleteDriver);

//bus
router.post("/addbus", addBus);
router.get("/bus/get", getBuses);
router.get("/bus/get_list", getBusesList);
router.get("/bus/get_list/:id", getRouteBusesList);
router.get("/bus/get/:id", ViewBus);
router.post("/bus/update/:id", UpdateBus);
router.delete("/bus/delete/:id", deleteBus);

export default router;
