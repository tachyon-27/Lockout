import { Router } from "express";
import { githubCallback, resetOTP, verifyEmail, googleCallback } from "../controllers/auth.controller.js";

const router = Router();
router.route("/github").post(githubCallback);
router.route('/verify-email').post(verifyEmail)
router.route('/reset-otp').post(resetOTP)
router.route("/google").post(googleCallback);

export default router;
