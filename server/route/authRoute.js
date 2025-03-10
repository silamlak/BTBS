import express from "express";
import {
  confirmOtp,
  createUser,
  refresh,
  requestPasswordReset,
  resetPassword,
  signIn,
  signup,
} from "../controller/authController.js";
const router = express.Router();

router.post("/admin/sign-up", signup);
router.post("/signup", createUser);
router.post("/confirm-otp", confirmOtp);
router.post("/signin", signIn);
router.post("/refresh", refresh);
router.post("/request/reset", requestPasswordReset);
router.post("/reset", resetPassword);

export default router;
