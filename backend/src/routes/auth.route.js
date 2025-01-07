import { Router } from "express";
import { githubCallback } from "../controllers/auth.controller";

const router = Router();
router.route("/github/callback").get(githubCallback);

export default router;
