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
            res.status(400)
            throw new Error('You do not have Admin permissions!')
        }
    
        if(!user.password) {
            res.status(400)
            throw new Error('Password not set!');
        }
    
        if(user && user.isVerified && (await bcrypt.compare(password, user.password))) {
    
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