import { Router } from "express";
import { addTournament } from "../controllers/tournament.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route('/add-tournament').post(
    verifyAdmin,
    upload.single("coverImage"),
    addTournament
);

export default router