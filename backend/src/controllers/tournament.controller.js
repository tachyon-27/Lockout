import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from 'bcryptjs'
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateToken } from "../utils/token.js";

export const addTournament = asyncHandler(async (req, res) => {
    try {        
        const {title, summary, startDate, description} = req.body;
    
        if(
            [title, summary, startDate, description].some((field)=> field.trim()==="")
        ) {
            res.status(400);
            throw new Error('Please Add all fields!');
        }

        const coverImageLocalPath = req.files?.coverImage[0].path

        if(!coverImageLocalPath) {
            res.status(400);
            throw new Error('Cover Image is required!');
        }
        
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);

        const tournament = tournament.create({
            title,
            summary,
            startDate,
            description,
            coverImage
        })

        return res.
            status(201).
            .json(new ApiResponse(201, "Tournament Added Successfully!", tournament))
    
    } catch (error) {
        res.status(401)
        throw new Error(error)
    }
})