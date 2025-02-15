import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Tournament from "../models/tournament.model.js";
import mongoose from "mongoose";
import axios from "axios";
import generateMatches from "../utils/tournament/MakeMatchFixtures.js";
import Question from "../models/question.model.js";
import { getIo } from "../socket.js";
import { UpdateProblemStatus } from "../utils/tournament/UpdateProblemStatus.js";
import { handleMatchEnd } from "../utils/tournament/matchEnd.js";

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
    } catch (error) {
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

        if (!_id) {
            return res.json(new ApiResponse(400, "Tournament ID is required"))
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.json(new ApiResponse(400, "Invalid Tournament ID"));
        }

        const tournament = await Tournament.findById(_id)

        if (!tournament) {
            return res.json(new ApiResponse(404, "Tournament not Found!"));
        }

        const participants = tournament.participants.map(participant => ({
            name: participant.cfid,
            maxRating: participant.maxRating
        }));

        return res.json(new ApiResponse(200, "Participants Retrieved successfully!", {
            show: tournament.showDetails,
            participants
        }))
    } catch (error) {
        console.log(error)
        res.status(500)
        throw new Error(error)
    }
})

export const startTournament = asyncHandler(async (req, res) => {
    try {
        const { tournamentId } = req.body;

        if (!tournamentId) {
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
        if(!tournament.matches) {
            tournament.matches = await generateMatches(tournament.participants);
        }
        tournament.showDetails = true;

        await tournament.save();

        res.json(new ApiResponse(200, "Tournament Started!"));
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        throw new Error("Server Error!");
    }
}); 

export const showTournament = asyncHandler(async (req, res) => {
    try {
        const { tournamentId } = req.body;

        if (!tournamentId) {
            return res.json(new ApiResponse(404, "Tournament Id not specified!"));
        }

        const tournament = await Tournament.findById(tournamentId).populate({
            path: "participants",
            select: "name",
        });

        if (!tournament) {
            return res.status(404).json(new ApiResponse(404, "Tournament not found!"));
        }

        if(!tournament.matches) {
            tournament.matches = await generateMatches(tournament.participants);
        }
        tournament.showDetails = true;

        await tournament.save();

        res.json(new ApiResponse(200, "Tournament fixtures is now visible to all users!"));
    } catch(error) {
        console.error(error);
        res.statusCode = 500;
        throw new Error("Error while showing tournament!");
    }
})

export const isTournamentShown = asyncHandler(async (req, res) => {
    try {
        const { tournamentId } = req.body;

        if (!tournamentId) {
            return res.json(new ApiResponse(404, "Tournament Id not specified!"));
        }

        const tournament = await Tournament.findById(tournamentId)

        if (!tournament) {
            return res.status(404).json(new ApiResponse(404, "Tournament not found!"));
        }

        res.json(new ApiResponse(200, "Tournament status fetched.", tournament.showDetails));
    } catch(error) {
        console.error(error);
        res.statusCode = 500;
        throw new Error("Error while fetching tournament show status!");
    }
})

export const hideTournament = asyncHandler(async (req, res) => {
    try {
        const { tournamentId } = req.body;

        if (!tournamentId) {
            return res.json(new ApiResponse(404, "Tournament Id not specified!"));
        }

        const tournament = await Tournament.findById(tournamentId)

        if (!tournament) {
            return res.status(404).json(new ApiResponse(404, "Tournament not found!"));
        }

        tournament.showDetails = false;
        await tournament.save();

        res.json(new ApiResponse(200, "Now users cannot see the fixtures and participants."));
    } catch(error) {
        console.error(error);
        res.statusCode = 500;
        throw new Error("Error while hiding tournament!");
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

export const getMatches = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.json(new ApiResponse(400, "Tournament ID is required"))
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.json(new ApiResponse(400, "Invalid Tournament ID"));
        }

        const tournament = await Tournament.findById(_id)

        if (!tournament) {
            return res.json(new ApiResponse(404, "Tournament not Found!"));
        }

        return res.json(new ApiResponse(200, "Matches Retrieved successfully!", {
            show: tournament.showDetails,
            matches: tournament.matches
        }))
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

const roomTimers = new Map();

const startMatchTimer = (roomId, startTime, duration, tournament, match) => {
    duration = parseInt(duration);
    const io = getIo();
    const startTim = new Date(startTime);
    const endTime = (startTim.getTime() + duration * 60 * 1000);

    function updateStatus() {
        const now = new Date();
        const remainingTime = endTime - now.getTime();
        if (remainingTime <= 0) {
            handleMatchEnd(tournament, match, io, roomId);
            roomTimers.delete(roomId);
            return;
        }
        UpdateProblemStatus(tournament, match).then(score => {
            io.to(roomId).emit("match-status", {
                success: true,
                status: "RUNNING",
                elapsed: ((now - startTime) / 1000 / 60).toFixed(1),
                updatedMatchScore: score
            });
        });
        const timeoutId = setTimeout(updateStatus, Math.min(90 * 1000, remainingTime));
        roomTimers.set(roomId, { startTime, endTime, timeoutId });
    }

    updateStatus();
}

export const startMatch = asyncHandler(async (req, res) => {
    try {
        let { tournamentId, matchId, startingRating, duration } = req.body;

        if (!tournamentId || !matchId) {
            throw new Error("All fields are required.")
        }
        const tournament = await Tournament.findById(tournamentId)
            .populate({
                path: 'matches.problemList.question', // Populating question
                model: 'Question',                    // Ensure the model name is correct
                select: 'name contestId index rating'  // Specify the fields to retrieve
            })


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

        if(!match.participants.length >= 1) return res.status(401).json(new ApiResponse(401, "Not Enough Participants to start a Match!"))

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
                question: question[0],
                points: 100 * (i + 1)
            }
            selectedQuestions.push(problem);
        }

        match.problemList = selectedQuestions
        match.duration = duration
        match.state = "RUNNING"
        match.startTime = Date.now()
        match.endTime = null;
        await tournament.save()

        // Refetch with populated questions
        const updatedTournament = await Tournament.findById(tournamentId).populate("matches.problemList.question");
        const updatedMatch = updatedTournament.matches.find(match => match.id == matchId);

        const io = getIo()
        io.to(`${tournamentId}_${matchId}`).emit('match-start',match);

        startMatchTimer(`${tournamentId}_${matchId}`, match.startTime, match.duration, tournament, match);

        return res
            .status(201)
            .json(new ApiResponse(201, "Match Started!", updatedMatch));
    } catch (error) {
        return res
            .status(501)
            .json(new ApiResponse(501, "Error while starting match.", error.message));
    }
})

export const endMatch = asyncHandler(async (req, res) => {
    try {
        const { tournamentId, matchId, winner } = req.body;

        if (!tournamentId || !matchId) {
            throw new Error("All fields are required.")
        }

        if(!winner) {
            return res.
            status(404)
            .json(new ApiResponse(404, "Winner not Specified"))
        }

        const tournament = await Tournament.findById(tournamentId).populate("matches.problemList.question");

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

        const winnerObj = match.participants.find(participant => participant._id.toString() === winner)

        if(!winnerObj) {
            return res.
            status(404)
            .json(new ApiResponse(404, "Winner not found! Please check the Id!"));
        }

        const roomId = `${tournamentId}_${matchId}`;
        if (roomTimers.has(roomId)) {
            clearTimeout(roomTimers.get(roomId).timeoutId);
            roomTimers.delete(roomId);
        }
        const io = getIo()
        await handleMatchEnd(tournament, match, io, roomId, winnerObj);

        await tournament.save();

        res
            .status(200)
            .json(new ApiResponse(200, "Match Ended!", match));

    } catch (error) {
        return res
            .status(501)
            .json(new ApiResponse(501, "Error While Ending Match!"))
    }
})

export const updateMatchDuration = asyncHandler(async (req, res) => {
    try {
        const { tournamentId, matchId, duration } = req.body;

        if (!tournamentId || !matchId || !duration) {
            throw new Error("All fields are required.");
        }

        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).json(new ApiResponse(404, "Tournament not Found!"));
        }

        const match = tournament.matches.find((match) => match.id == matchId);
        if (!match) {
            return res.status(404).json(new ApiResponse(404, "Match not Found!"));
        }

        if (match.state !== "RUNNING") {
            return res.status(400).json(new ApiResponse(400, "Match is not running."));
        }

        if(match.duration) {
            match.duration += duration;
        } else {
            match.duration = duration;
        }
        await tournament.save();

        const roomId = `${tournamentId}_${matchId}`;

        if (roomTimers.has(roomId)) {
            clearTimeout(roomTimers.get(roomId).timeoutId);
            roomTimers.delete(roomId);
        }

        const io = getIo()
        io.to(`${tournamentId}_${matchId}`).emit('add-duration', match);

        startMatchTimer(roomId, match.startTime, match.duration, tournament, match);

        return res.status(200).json(new ApiResponse(200, "Match duration updated!", match));
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, "Error updating match duration.", error.message));
    }
});

export const giveBye = asyncHandler(async (req, res) => {
    try {
        
        const {tournamentId, matchId, byeTo} = req.body;

        if (!tournamentId || !matchId ||!byeTo) {
            res.statusCode=500;
            throw new Error("All fields are required.")
        }
        const tournament = await Tournament.findById(tournamentId).populate("matches.problemList.question");

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

        const byeToObj = match.participants.find(participant => participant._id.toString() === byeTo);

        match.participants[0].resultText = null;
        if(match.participants.length > 1) match.participants[1].resultText = null;
        
        if (match.nextMatchId) {
            const nextMatch = tournament.matches.find(m => m.id == match.nextMatchId);
            if (nextMatch) {
                nextMatch.participants = nextMatch.participants.filter(participant => participant.cfid != match.participants[0].cfid && match.participants.length > 1 && participant.cfid != match.participants[1].cfid )
                nextMatch.participants.push(byeToObj.toObject());
            }
        }
        match.participants.find(p => p.cfid === byeToObj.cfid).resultText = "BYE";

        match.endTime = Date.now()
        match.state = "DONE";

        await tournament.save();

        const io = getIo()

        const roomId = `${tournamentId}_${matchId}`;
        if (roomTimers.has(roomId)) {
            clearTimeout(roomTimers.get(roomId).timeoutId);
            roomTimers.delete(roomId);
        }

        io.to(roomId).emit({
            success: true,
            status: "BYE",
            match,
            winner: byeToObj,
        })

        res
        .status(200)
        .json(new ApiResponse(200, "Successfully Gave Bye", match))

    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
});

export const customTieBreaker = asyncHandler(async (req, res) => {
    try {
        
        const { tournamentId, matchId, customTieBreaker } = req.body;

        if(!tournamentId) {
            return res.json(new ApiResponse(404, "Tournament Id required!"))
        }

        if(!matchId) {
            return res.json(new ApiResponse(404, "Match Id required!"))
        }

        if(!customTieBreaker) {
            return res.json(new ApiResponse(404, "Please Specify the custom Tie Breaker!"))
        }

        const tournament = await Tournament.findById(tournamentId)

        if(!tournament)
            return res.json(new ApiResponse(404, "Tournament not Found!"))

        const match = tournament.matches.find(match => match.id === matchId)

        if(!match) 
            return res.json(new ApiResponse(404, "Match Not found"))




    } catch (error) {
        
    }
});