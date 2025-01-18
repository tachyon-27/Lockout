import { Router } from "express";
import { githubCallback, resetOTP, verifyEmail, googleCallback } from "../controllers/auth.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/github").post(githubCallback);
router.route("/google").post(googleCallback);

// secured routes
router.route('/verify-email').post(verifyUser, verifyEmail)
router.route('/reset-otp').post(verifyUser, resetOTP)

export default router;