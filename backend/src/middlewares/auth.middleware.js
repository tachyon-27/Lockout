import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.token

        if (!token) {
            res.status(401)
            throw new Error("Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password");

        if (!user) {
            throw new Error("Invalid Token")
        }

        if (!user.isAdmin) {
            return res.json(new ApiResponse(401, "Access Denired!"))
        }

        req.admin = user;
        next()
    }
    catch (error) {
        res.status(401)
        throw new Error(error?.message || "Invalid Access Token");
    }
})

export const verifyUser = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.token

        if (!token) {
            res.status(401)
            throw new Error("Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new Error("Invalid Token")
        }

        req.user = user;
        next()
    }
    catch (error) {
        res.status(401)
        throw new Error(error?.message || "Invalid Access Token");
    }
})

export const checkCurrentPassword = asyncHandler(async (req, res, next) => {
    try {
        const { currentPassword } = req.body;
        const user = req.user;

        if (!currentPassword && !user.password) {
            user.verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);
            user.canChangePassword = true;
            await user.save();
            return next();
        }

        if (!currentPassword) {
            return res.json(new ApiResponse(400, "Current password is required!"));
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.json(new ApiResponse(401, "Incorrect current password!"));
        }

        user.verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);
        user.canChangePassword = true;
        await user.save();
        next();
        
    } catch (error) {
        console.error("Error in checkCurrentPassword:", error);
        return res.status(500).json(new ApiResponse(500, "Internal Server Error"));
    }
});

