import { Router } from "express";
import {
    addTournament, 
    customTieBreaker, 
    deleteTournament, 
    endMatch, 
    endTournament, 
    getMatch, 
    getMatches, 
    getParticipantsList, 
    getTournament, 
    getTournamentUser, 
    giveBye, 
    hideTournament, 
    isTournamentShown, 
    removeParticipant, 
    restartTournament, 
    showTournament, 
    startMatch, 
    startTournament, 
    tournamentRegister, 
    tournaments, 
    tournamentUnregister, 
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
router.route('/start-tournament').post(verifyAdmin, startTournament)
router.route('/restart-tournament').post(verifyAdmin, restartTournament)
router.route('/end-tournament').post(verifyAdmin, endTournament)
router.route('/show-tournament').post(verifyAdmin, showTournament)
router.route('/hide-tournament').post(verifyAdmin, hideTournament)
router.route('/is-tournament-shown').post(verifyAdmin, isTournamentShown)
router.route('/start-match').post(verifyAdmin, startMatch)
router.route('/end-match').post(verifyAdmin, endMatch)
router.route('/tie-break').post(verifyAdmin, customTieBreaker)
router.route('/add-duration').post(verifyAdmin, updateMatchDuration)
router.route('/give-bye').post(verifyAdmin, giveBye)
router.route('/delete-tournament').post(verifyAdmin, deleteTournament)
router.route('/remove-participant').post(verifyAdmin, removeParticipant)

router.route('/get-tournament-user').post(verifyUser, getTournamentUser)
router.route('/tournament-register').post(verifyUser, tournamentRegister)
router.route('/tournament-unregister').post(verifyUser, tournamentUnregister)

export default router