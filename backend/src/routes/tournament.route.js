import { Router } from "express";
import { addTournament } from "../controllers/tournament.controller";
import { verifyAdmin } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = Router()

router.route('/add-tournament').post(
    verifyAdmin,
    upload.single("coverImage"),
    addTournament
);

export default router