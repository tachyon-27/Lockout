import { Router } from "express";
import { githubCallback, resetOTP, verifyEmail } from "../controllers/auth.controller.js";

const router = Router();
router.route("/github").post(githubCallback);
router.route('/verify-email').post(verifyEmail)
router.route('/reset-otp').post(resetOTP)

export default router;
