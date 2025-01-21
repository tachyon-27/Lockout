import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Tournament from "../models/tournament.model.js";
import mongoose from "mongoose";

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