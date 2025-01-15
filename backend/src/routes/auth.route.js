import { Router } from "express";
import { githubCallback, resetOTP, verifyEmail, googleCallback } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/github").post(githubCallback);
router.route("/google").post(googleCallback);

// secured routes
router.route('/verify-email').post(verifyJWT, verifyEmail)
router.route('/reset-otp').post(verifyJWT, resetOTP)

export default router;
