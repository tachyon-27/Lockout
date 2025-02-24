import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  sendEmail,
  getUser,
  passwordOTP,
  resetPassword,
  getCFIDs, 
  githubCallback, 
  resetOTP, 
  verifyEmail, 
  googleCallback,
  getUsers,
  refresh,
  editName,
  removeCFID,
  getLoggedinUser
} from "../controllers/user.controller.js";
import { checkCurrentPassword, verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/send-email").post(sendEmail);
router.route("/get-user").post(getUser)
router.route("/password-otp").post(passwordOTP)
router.route("/reset-password").post(resetPassword)
router.route("/github").post(githubCallback);
router.route("/google").post(googleCallback);
router.route('/verify-email').post(verifyEmail)
router.route('/reset-otp').post(resetOTP)
router.route('/get-users').get(getUsers)
router.route('/refresh').post(refresh)

// secured routes
router.route("/logout").get(verifyUser, logoutUser)
router.route("/get-cfids").get(verifyUser, getCFIDs)
router.route('/set-password').post(verifyUser, checkCurrentPassword, resetPassword)
router.route('/edit-name').post(verifyUser, editName)
router.route('/remove-cfid').post(verifyUser, removeCFID)
router.route('/get-loggedin-user').get(verifyUser, getLoggedinUser)

export default router;
