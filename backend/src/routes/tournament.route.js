import { Router } from "express";
import {
    addTournament, 
    deleteTournament, 
    endMatch, 
    getMatch, 
    getMatches, 
    getParticipantsList, 
    getTournament, 
    giveBye, 
    removeParticipant, 
    showTournament, 
    startMatch, 
    startTournament, 
    tournamentRegister, 
    tournaments, 
    updateMatchDuration, 
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
<<<<<<< HEAD
router.route('/show-tournament').get(verifyAdmin, showTournament)
router.route('/start-match').post(verifyAdmin, startMatch)
=======
router.route('/start-match').post(startMatch)
router.route('/end-match').post(endMatch)
router.route('/add-duration').post(updateMatchDuration)
router.route('/give-bye').post(giveBye)
>>>>>>> 62fa91662aeccaad2f2f4c9ef349d8f94bfe863c
router.route('/delete-tournament').post(verifyAdmin, deleteTournament)
router.route('/remove-participant').post(verifyAdmin, removeParticipant)

router.route('/tournament-register').post(verifyUser, tournamentRegister)

export default router