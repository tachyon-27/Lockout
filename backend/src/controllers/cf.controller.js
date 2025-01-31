import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import generateRandomString from "../utils/generateRandomString.js";
import axios from 'axios';
import Tournament from "../models/tournament.model.js";

export const addCFID = asyncHandler(async (req, res) => {
    try {
        const { cfid } = req.body;
        const user = req.user;

        const cfuser = user.codeforcesID.find((cfhandle) => cfhandle.cfid === cfid);
        const verifyString = generateRandomString();

        if (cfuser) {
            if (cfuser.isVerified) {
                return res.json(new ApiResponse(401, "Codeforces handle already exists!"));
            } else {
                cfuser.verifyString = verifyString;
                await user.save();
            }
        } else {
            user.codeforcesID.push({
                cfid,
                verifyString,
            });
            await user.save();
        }

        return res.status(201).json(new ApiResponse(201, "Codeforces ID added, authorize it.", { verifyString }));
    } catch (error) {
        res.status(501);
        throw new Error(error);
    }
});

export const verifyCFID = asyncHandler(async (req, res) => {
    try {
        const { cfid } = req.body;
        const cfres = await axios.get(`https://codeforces.com/api/user.info?handles=${cfid}`)

        const code = cfres.data.result[0].firstName;
        const updatedUser = await User.findOneAndUpdate(
            {
                _id: req.user._id,
                'codeforcesID.cfid': cfid,
                'codeforcesID.verifyString': code
            },
            {
                $set: { 'codeforcesID.$.isVerified': true },
                $unsset: { 'codeforcesID.$.verifyString': 1 }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.json(new ApiResponse(401, "Unable to authorize the codeforces handle, please try again."))
        }
        else {
            return res
                .status(201)
                .json(new ApiResponse(201, "Codeforces handle authorized successfully."))
        }
    } catch (error) {
        res.status(501)
        res.json(new ApiResponse(501, error))
    }
})

export const UpdateProblemStatus = asyncHandler(async (req, res) => {
    try {

        // Start Time whether to take from backend or frontend still not confirmed!
        const { tournamentId, problemList, startTime } = req.body;
        const user = req.user;

        if(!user) {
            return res.json(new ApiResponse(404, "User not specified!"));
        }

        if(!tournamentId) {
            return res.json(new ApiResponse(404, "TournamentId required!"));
        }

        if(!problemList) {
            return res.json(new ApiResponse(404, "problemList required!"));
        }

        if(!startTime) {
            return res.json(new ApiResponse(404, "startTime required!"));
        }
        

        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.json(new ApiResponse(404, "Tournament not Found!"));
        }

        const participant = tournament.participants.find(participant => participant.user === user);
        if (!participant) {
            return res.json(new ApiResponse(404, "Participant not found in the tournament"));
        }

        const cfid = participant.cfid;

        const response = await axios.get(`https://codeforces.com/api/user.status?handle=${cfid}`);

        if (response.data.status !== "OK") {
            res.status(500);
            throw new Error("Failed to fetch submissions from Codeforces");
        }

        const submissions = response.data.result;

        const startTimestamp = new Date(startTime).getTime();

        const validSubmissions = submissions.filter(submission => {
            const submissionTime = submission.creationTimeSeconds * 1000;
            return submissionTime >= startTimestamp && submission.verdict === "OK";
        });
        
        const updatedProblemList = problemList.map(problem => {
            const hasSolvedProblem = validSubmissions.some(submission => 
                submission.problem.contestId === problem.contestId &&
                submission.problem.index === problem.index
            );
        
            return {
                ...problem,
                solved: hasSolvedProblem
            };
        });
        
        res.json(new ApiResponse(200, "Problem List Updated!", updatedProblemList));
    } catch (error) {
        res.status(500)
        throw new Error("Server Error!")
    }
})