import { Router } from "express";
import { 
    addTournament, 
    getMatch, 
    getMatches, 
    getParticipantsList, 
    getTournament, 
    startMatch, 
    startTournament, 
    tournamentRegister, 
    tournaments, 
    updateTournament 
} from "../controllers/tournament.controller.js";
import { verifyAdmin, verifyUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route('/tournaments').get(tournaments)
router.route('/get-tournament').post(getTournament) 
router.route('/get-participants').post(getParticipantsList)
router.route('/get-matches').post(getMatches)
router.route('/get-match').post(getMatch)

// secured routes
router.route('/add-tournament').post(
    verifyAdmin,
    upload.single("coverImage"),
    addTournament
);
router.route('/update-tournament/:tournamentId').post(
    verifyAdmin,
    upload.single("coverImage"),
    updateTournament
);
router.route('/start-tournament').get(verifyAdmin, startTournament)
router.route('/start-match').post(startMatch)

router.route('/tournament-register').post(verifyUser, tournamentRegister)

export default router