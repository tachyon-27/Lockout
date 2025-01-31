import { Router } from "express";
import { addCFID, UpdateProblemStatus, verifyCFID } from "../controllers/cf.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router()

// secured routes
router.route('/add-id').post(verifyUser, addCFID)
router.route('/verify-id').post(verifyUser, verifyCFID)
router.route('/check-problems-status').post(verifyUser, UpdateProblemStatus)
 
export default router