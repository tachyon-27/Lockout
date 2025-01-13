import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  sendEmail,
  getUser,
  passwordOTP,
  resetPassword
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/send-email").post(sendEmail);
router.route("/get-user").post(getUser)
router.route("/password-otp").post(passwordOTP)
router.route("/reset-password").post(resetPassword)

// secured routes
router.route("/logout").get(verifyJWT, logoutUser)

export default router;
