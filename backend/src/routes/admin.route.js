import { Router } from "express";
import { 
    addAdmin, 
    loginAdmin, 
    removeAdmin 
} from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/login').post(loginAdmin);

// secured routes
router.route('/add-admin').post(verifyAdmin, addAdmin)
router.route('/remove-admin').post(verifyAdmin, removeAdmin)

export default router