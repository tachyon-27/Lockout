import { Router } from "express";
import { addTournament, getTournament, tournaments, updateTournament } from "../controllers/tournament.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route('/add-tournament').post(
    verifyAdmin,
    upload.single("coverImage"),
    addTournament
);
router.route('/update-tournament/:tournamentId').post(
    upload.single("coverImage"),
    updateTournament
);

router.route('/tournaments').get(tournaments)
router.route('/get-tournament').post(getTournament) 

export default router