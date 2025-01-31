import { Router } from "express";
import { 
    addCFID, 
    generateProblemList, 
    populateQuestions, 
    UpdateProblemStatus, 
    verifyCFID 
} from "../controllers/cf.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/populate-questions').get( populateQuestions)
router.route('/generate-problemlist').post(generateProblemList)

// secured routes
router.route('/add-id').post(verifyUser, addCFID)
router.route('/verify-id').post(verifyUser, verifyCFID)
router.route('/update-match-problems').post(verifyUser, UpdateProblemStatus)
 

export default router