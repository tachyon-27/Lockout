import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Tournament from "../models/tournament.model.js";
import mongoose from "mongoose";
import axios from "axios";
import generateMatches from "../utils/tournament/MakeMatchFixtures.js";
import Question from "../models/question.model.js";

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

export const deleteTournament = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.body

        if (!_id) {
            throw new Error("Id is required")
        }

        const deletedTournament = await Tournament.findByIdAndDelete(_id);

        if (!deletedTournament) {
            return res
                .status(404)
                .json(new ApiResponse(404, "Tournament not found."));
        }

        return res
            .status(200)    
            .json(new ApiResponse(200, "Tournament deleted successfully."))
    } catch(error) {
        return res
            .status(500)
            .json(new ApiResponse(500, "Error while deleting tournament.", error.message));
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
    
        const tournament = await Tournament.findById(_id)
        
        if(!tournament) {
            return res.json(new ApiResponse(404, "Tournament not Found!"));
        }
        
        const participants = tournament.participants.map(participant => ({
            name: participant.cfid,
            maxRating: participant.maxRating 
        }));

        return res.json(new ApiResponse(200, "Participants Retrieved successfully!", participants))
    } catch (error) {
        console.log(error)
        res.status(500)
        throw new Error(error)
    }
})

export const startTournament = asyncHandler(async (req, res) => {
    try {
        const { tournamentId } = req.body;

        if(!tournamentId) {
            return res.json(new ApiResponse(404, "Tournament Id not specified!"));
        }

        const tournament = await Tournament.findById(tournamentId).populate({
            path: "participants",
            select: "name",  
        });

        if (!tournament) {
            return res.status(404).json(new ApiResponse(404, "Tournament not found!"));
        }

        tournament.startDate = new Date();
        tournament.matches = await generateMatches(tournament.participants);
        // console.log(tournament.matches)

        await tournament.save();

        res.json(new ApiResponse(200, "Tournament Started!"));

    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        throw new Error("Server Error!");
    }
});

export const getMatches = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.body;
    
        if(!_id) {
            return res.json(new ApiResponse(400, "Tournament ID is required"))
        }

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.json(new ApiResponse(400, "Invalid Tournament ID"));
        }
    
        const tournament = await Tournament.findById(_id)
        
        if(!tournament) {
            return res.json(new ApiResponse(404, "Tournament not Found!"));
        }

        return res.json(new ApiResponse(200, "Matches Retrieved successfully!", tournament.matches))
    } catch (error) {
        return res
          .status(501)
          .json(new ApiResponse(501, "Error while getting matches.", error));
    }
})

export const getMatch = asyncHandler(async (req, res) => {
    try {
        const { _id, matchId } = req.body;

        if (!_id) {
            return res
                .status(400)
                .json(new ApiResponse(400, "Tournament ID is required"));
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res
                .status(400)
                .json(new ApiResponse(400, "Invalid Tournament ID"));
        }

        const tournament = await Tournament.findById(_id).populate("matches.problemList.question")

        if (!tournament) {
            return res.
                status(404)
                .json(new ApiResponse(404, "Tournament not Found!"));
        }

        const match = tournament.matches.find(match => match.id == matchId);

        if (!match) {
            return res
                .json(new ApiResponse(404, "Match not Found!"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, "Match Retrieved successfully!", match));
    } catch (error) {
        return res
            .status(500)
            .json(new ApiResponse(500, "Error while getting match.", error.message));
    }
});

export const startMatch = asyncHandler(async (req, res) => {
    try {
        let {tournamentId, matchId, startingRating, duration} = req.body;

        if(!tournamentId || !matchId) {
            throw new Error("All fields are required.")
        }
        const tournament = await Tournament.findById(tournamentId)

        if (!tournament) {
            return res.
                status(404)
                .json(new ApiResponse(404, "Tournament not Found!"));
        }

        const match = tournament.matches.find(match => match.id == matchId);

        if (!match) {
            return res
                .json(new ApiResponse(404, "Match not Found!"));
        }

        // generating problem list
        startingRating = parseInt(startingRating);
        if (isNaN(startingRating) || startingRating < 800) {
            return res.json(new ApiResponse(400, 'startingRating must be a number and at least 800'));
        }

        let selectedQuestions = [];

        for (let i = 0; i < 5; i++) {
            const ratingThreshold = startingRating + (i * 100);

            const question = await Question.aggregate([
                { $match: { rating: ratingThreshold } },
                { $sample: { size: 1 } }
            ]);

            if (question.length === 0) {
                return res
                    .status(404)
                    .json(new ApiResponse(404, `No question found for rating == ${ratingThreshold}`));
            }
            
            const problem = {
                question: question[0]._id,
                points: 100 * (i+1)
            }
            selectedQuestions.push(problem);
        }

        match.problemList = selectedQuestions
        match.duration = duration
        match.state = "RUNNING"
        match.startTime = Date.now()
        console.log(match)
        await tournament.save()

        // Refetch with populated questions
        const updatedTournament = await Tournament.findById(tournamentId).populate("matches.problemList.question");
        const updatedMatch = updatedTournament.matches.find(match => match.id == matchId);

        return res
            .status(201)
            .json(new ApiResponse(201, "Match Started!", updatedMatch));
    } catch(error) {
        return res
          .status(501)
          .json(new ApiResponse(501, "Error while starting match.", error.message));
    }
})

export const endMatch = asyncHandler( async (req, res) => {
    try {
        const { tournamentId, matchId } = req.body;

        if(!tournamentId || !matchId) {
            throw new Error("All fields are required.")
        }
        const tournament = await Tournament.findById(tournamentId)

        if (!tournament) {
            return res.
                status(404)
                .json(new ApiResponse(404, "Tournament not Found!"));
        }

        const match = tournament.matches.find(match => match.id == matchId);

        if (!match) {
            return res
                .json(new ApiResponse(404, "Match not Found!"));
        }

        const winner = match.participants[0].totalPoints > match.participants[1].totalPoints ? match.participants[0] : match.participants[1];

        winner.resultText = "WON";

        if(match.nextMatchId) {
            const nextmatch = tournament.matches.find(match => match.id == match.nextMatchId);
            nextmatch.participants.push(winner);
            await tournament.save()
        }

        await tournament.save();

        res
        .status(200)
        .json(new ApiResponse(200, "Match Ended!"));

    } catch (error) {
        return res
        .status(501)
        .json(new ApiResponse(501, "Error While Ending Match!"))
    }
})

export const removeParticipant = asyncHandler(async (req, res) => {
    try {
        const { tournamentId, cfid } = req.body;

        if (!tournamentId || !cfid) {
            throw new Error("Tournament ID and CFID are required.");
        }

        const tournament = await Tournament.findById(tournamentId);

        if (!tournament) {
            throw new Error("Tournament not found.");
        }

        const updatedParticipants = tournament.participants.filter(
            (participant) => participant.cfid !== cfid
        );

        if (updatedParticipants.length === tournament.participants.length) {
            throw new Error("Participant not found in the tournament.");
        }

        tournament.participants = updatedParticipants;
        await tournament.save();

        return res
            .status(200)
            .json(new ApiResponse(200, "Participant removed successfully."));
    } catch (error) {
        return res
            .status(500)
            .json(new ApiResponse(500, error.message));
    }
});