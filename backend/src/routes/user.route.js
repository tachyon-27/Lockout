import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  sendEmail
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/send-email").post(sendEmail);

// secured routes
router.route("/logout").get(verifyJWT, logoutUser)

export default router;
