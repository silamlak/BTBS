import express from "express";
import { verifyJWT } from "../middleware/verifyToken.js";
import {
  addPlace,
  addRoute,
  addSchedule,
  deletePlace,
  deleteRoute,
  deleteSchedule,
  getRoute,
  getRouteList,
  getSchedule,
  getStations,
  UpdatePlace,
  UpdateRoute,
  UpdateSchedule,
  ViewPlace,
  ViewRoute,
  ViewSchedule,
} from "../controller/boController.js";
const router = express.Router();

//route
router.post("/addroute", addRoute);
router.get("/route/get", getRoute);
router.get("/route/get_list", getRouteList);
router.get("/route/get/:id", ViewRoute);
router.post("/route/update/:id", UpdateRoute);
router.delete("/route/delete/:id", deleteRoute);

//stationPlace
router.post("/addplace", addPlace);
router.get("/place/get", getStations);
router.get("/place/get/:id", ViewPlace);
router.post("/place/update/:id", UpdatePlace);
router.delete("/place/delete/:id", deletePlace);

//schedule
router.post("/addschedule", addSchedule);
router.get("/schedule/get", getSchedule);
router.get("/schedule/get/:id", ViewSchedule);
router.post("/schedule/update/:id", UpdateSchedule);
router.delete("/schedule/delete/:id", deleteSchedule);

export default router;
