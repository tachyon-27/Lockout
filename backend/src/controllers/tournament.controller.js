import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Tournament from "../models/tournament.model.js";

export const addTournament = asyncHandler(async (req, res) => {
    try {        
        const {title, summary, startDate, startTime, description} = req.body;
    
        if(
            [title, summary, startDate, description, startTime].some((field)=> field.trim()==="")
        ) {
            res.status(400);
            throw new Error('Please Add all fields!');
        }

        const coverImageLocalPath = req.file.path
        if(!coverImageLocalPath) {
            res.status(400);
            throw new Error('Cover Image is required!');
        }
        
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);
        
        const tournament = await Tournament.create({
            title,
            summary,
            startDate,
            startTime,
            description,
            coverImage: coverImage.url
        })

        console.log(tournament)
        
        return res
            .status(201)
            .json(new ApiResponse(201, "Tournament Added Successfully!", tournament))
    
    } catch (error) {
        res.status(401)
        throw new Error(error)
    }
})