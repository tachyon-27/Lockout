import { Router } from "express";
import { githubCallback } from "../controllers/auth.controller.js";

const router = Router();
router.route("/github").post(githubCallback);
router.route("/google").post(googleCallback);

export default router;
