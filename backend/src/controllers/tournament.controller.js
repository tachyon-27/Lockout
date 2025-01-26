import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Tournament from "../models/tournament.model.js";
import mongoose from "mongoose";
import axios from "axios";

export const addTournament = asyncHandler(async (req, res) => {
    try {
        const { title, summary, startDate, description } = req.body;

        if (
            [title, summary, startDate, description].some((field) => field.trim() === "")
        ) {
            res.status(400);
            throw new Error('Please Add all fields!');
        }

        const coverImageLocalPath = req.file.path
        if (!coverImageLocalPath) {
            res.status(400);
            throw new Error('Cover Image is required!');
        }

        const coverImage = await uploadOnCloudinary(coverImageLocalPath);

        const tournament = await Tournament.create({
            title,
            summary,
            startDate,
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

export const updateTournament = asyncHandler(async (req, res) => {
    try {
        const { title, summary, startDate, description } = req.body;
        const { tournamentId } = req.params;

        if (!tournamentId) {
            res.status(400)
            throw new Error('Add Tournament id')
        }

        // console.log(title, summary, startDate, description, req.file.path)
        // console.log("hi")
        if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
            res.status(400);
            throw new Error('Invalid tournamentId');
        }


        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            res.status(404);
            throw new Error('Tournament not found!');
        }


        if ([title, summary, startDate, description].some((field) => field.trim() === "")) {
            res.status(400);
            throw new Error('Please Add all fields!');
        }

        let coverImageUrl = tournament.coverImage;

        if (req.file?.path) {
            const coverImageLocalPath = req.file.path;
            coverImageUrl = await uploadOnCloudinary(coverImageLocalPath);
            coverImageUrl = coverImageUrl.url;
        }

        console.log(coverImageUrl)

        tournament.title = title;
        tournament.summary = summary;
        tournament.startDate = startDate;
        tournament.description = description;
        tournament.coverImage = coverImageUrl;

        console.log(tournament)

        await tournament.save();

        return res
            .status(200)
            .json(new ApiResponse(200, "Tournament Updated Successfully!", tournament));

    } catch (error) {
        console.log(error)
        res.status(400);
        throw new Error(error.message || error);
    }
});

export const tournaments = asyncHandler(async (req, res) => {
    try {
        const data = await Tournament.find({})
        return res
            .status(201)
            .json(new ApiResponse(201, "All tournaments fetched successfully.", data))
    } catch (error) {
        res.status(401)
        throw new Error(error)
    }
})

export const getTournament = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.body

        if (!_id) {
            res.status(401)
            throw new Error("ID is required!")
        }

        const tournament = await Tournament.findById(_id)

        if (!tournament) {
            res.status(404)
            throw new Error("Tournament not found!")
        }

        return res
            .status(201)
            .json(new ApiResponse(201, "Tournament fetched successfully!", tournament))
    } catch (error) {
        res.status(401)
        throw new Error(error)
    }
})

export const tournamentRegister = asyncHandler(async (req, res) => {
    try {
        const { _id, cfid } = req.body;

        if (!_id || !cfid) {
            return res.json(new ApiResponse(400, "Tournament ID and Codeforces ID are required."));
        }

        const tournament = await Tournament.findById(_id);
        if (!tournament) {
            return res.json(new ApiResponse(404, "Tournament not found."));
        }

        const cfres = await axios.get(`https://codeforces.com/api/user.info?handles=${cfid}`);
        const userInfo = cfres.data.result[0];

        if (!userInfo) {
            return res.json(new ApiResponse(404, "Codeforces user not found."));
        }

        const maxRating = userInfo.maxRating;

        const alreadyRegistered = tournament.participants?.some(participant => participant.cfid === cfid);
        if (alreadyRegistered) {
            return res.json(new ApiResponse(400, "User is already registered for this tournament."));
        }

        tournament.participants.push({
            user: req.user._id,
            cfid,
            maxRating
        });

        await tournament.save();

        return res
            .status(201)
            .json(new ApiResponse(201, "User successfully registered to the tournament"));
        
    } catch (error) {
        console.log(error)
        return res.json(new ApiResponse(500, "An error occurred while registering for the tournament.", error));
    }
});

export const getParticipantsList = asyncHandler(async (req, res) => {

    try {
        
        const { _id } = req.body;
    
        if(!_id) {
            return res.json(new ApiResponse(400, "Tournament ID is required"))
        }

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.json(new ApiResponse(400, "Invalid Tournament ID"));
        }
    
        const tournament = await Tournament.findById(_id).populate({
            path: 'participants.user',
            select: 'name'
        });
    
        
        if(!tournament) {
            return res.json(new ApiResponse(404, "Tournament not Found!"));
        }
        
        const participants = tournament.participants.map(participant => ({
            name: participant.user.name,
            maxRating: participant.maxRating 
        }));

        return res.json(new ApiResponse(200, "Participants Retrieved successfully!", participants))

    } catch (error) {
        console.log(error)
        res.status(500)
        throw new Error(error)
    }

})