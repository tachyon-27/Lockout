import { Router } from "express";
import { 
    addCFID, 
    generateProblemList, 
    populateQuestions, 
    UpdateProblemStatus, 
    verifyCFID 
} from "../controllers/cf.controller.js";
import { verifyUser, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router()

// secured routes
router.route('/populate-questions').get(verifyAdmin, populateQuestions)
router.route('/generate-problemlist').post(verifyAdmin ,generateProblemList)

router.route('/add-id').post(verifyUser, addCFID)
router.route('/verify-id').post(verifyUser, verifyCFID)
router.route('/update-match-problems').post(UpdateProblemStatus)
 
export default router