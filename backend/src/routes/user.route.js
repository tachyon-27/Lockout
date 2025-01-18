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
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/send-email").post(sendEmail);
router.route("/get-user").post(getUser)

// secured routes
router.route("/logout").get(verifyUser, logoutUser)
router.route("/password-otp").post(verifyUser, passwordOTP)
router.route("/reset-password").post(verifyUser, resetPassword)

export default router;
