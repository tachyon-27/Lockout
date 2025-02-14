import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateToken } from "../utils/token.js";

export const loginAdmin = asyncHandler(async (req, res) => {
    try {        
        const {email, password} = req.body;
    
        if(!email || !password) {
            res.status(400);
            throw new Error('Please Add all fields!');
        }
    
        const user = await User.findOne({email});
    
        if(!user || !user.isAdmin) {
            return res.json(new ApiResponse(401, "Unauthourised request!"))
        }
    
        if(!user.password) {
            return res.json(new ApiResponse(401, "Password not set!"))
        }
    
        if( (await bcrypt.compare(password, user.password))) {    
            const token = generateToken(user._id);
            
            const options = {
                httpOnly: true,
                secure: true,
            }
    
            res
            .status(201)
            .cookie("token", token, options)
            .json(new ApiResponse(201, "Admin Logged in Successfully", user))
        } else {
            res.json(new ApiResponse(401, "Invalid email or password"))
        }
    } catch (error) {
        res.status(401)
        throw new Error(error)
    }
})

export const addAdmin = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;

        if(!email) {
            throw new Error("Email is required.")
        }

        const user = await User.findOne({email})

        if(!user || !user.isVerified) {
            throw new Error("User not found.")
        }

        user.isAdmin = true;
        await user.save();

        return res
            .status(201)
            .json(new ApiResponse(201, "User promoted to Admin.", user))
    } catch(error) {
        res.status(401)
        throw new Error(error)
    }
})

export const removeAdmin = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;

        if(!email) {
            throw new Error("Email is required.")
        }

        const user = await User.findOne({email})

        if(!user || !user.isVerified) {
            throw new Error("User not found.")
        }

        user.isAdmin = false;
        await user.save();

        return res
            .status(201)
            .json(new ApiResponse(201, "User is no longer an Admin.", user))
    } catch(error) {
        res.status(401)
        throw new Error(error)
    }
})