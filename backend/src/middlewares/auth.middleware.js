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

        const user = await User.findById(decodedToken?._id).select("-password");

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
        const { currentPassword, _id } = req.body;
        
        if (!_id || currentPassword === undefined) {
            return res.status(400).json(new ApiResponse(400, "User ID and Current Password are required!"));
        }

        const user = await User.findById(_id);
        
        if (!user) {
            return res.status(404).json(new ApiResponse(404, "User not found!"));
        }
        
        if (!user.isVerified) {
            return res.status(403).json(new ApiResponse(403, "User is not verified!"));
        }
        
        if (currentPassword === "" && user.canChangePassword) {
            return next();
        }

        if (!currentPassword) {
            return res.status(400).json(new ApiResponse(400, "Current Password is required!"));
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        
        if (!isMatch) {
            return res.status(401).json(new ApiResponse(401, "Incorrect Current Password!"));
        }
        
        user.canChangePassword = true;
        await user.save();
        next();
    } catch (error) {
        console.error("Error in checkCurrentPassword:", error);
        throw new Error(error);
    }
});
