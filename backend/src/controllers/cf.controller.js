import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import generateRandomString from "../utils/generateRandomString.js";
import axios from 'axios';
import Tournament from "../models/tournament.model.js";
import Question from "../models/question.model.js";

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
        const { tournamentId, matchId } = req.body;

        if (!matchId) {
            return res.json(new ApiResponse(404, "Match id not specified!"));
        }

        if (!tournamentId) {
            return res.json(new ApiResponse(404, "Tournament Id not specified!"));
        }

        const tournament = await Tournament.findById(tournamentId);

        if (!tournament) {
            return res.json(new ApiResponse(404, "Tournament not found!"));
        }

        const match = tournament.matches.find(match => match.id === matchId);

        if (!match) {
            return res.json(new ApiResponse(404, "Match not found!"));
        }

        if (match.startTime > new Date()) {
            return res.json(new ApiResponse(400, "Match not yet started!"));
        }

        if (match.participants.length !== 2) {
            return res.json(new ApiResponse(400, "Match does not have 2 participants!"));
        }

        await match.populate("problemList.question");

        const problemList = match.problemList;
        const cfid1 = match.participants[0].cfid;
        const cfid2 = match.participants[1].cfid;
        const startTimestamp = new Date(match.startTime).getTime();

        const p1Response = await axios.get(`https://codeforces.com/api/user.status?handle=${cfid1}`);
        if (p1Response.data.status !== "OK") {
            throw new Error("Failed to fetch submissions from Codeforces for Player 1");
        }
        const p1Submissions = p1Response.data.result;

        const p1ValidSubmissions = p1Submissions.filter(submission => {
            const submissionTime = submission.creationTimeSeconds * 1000;
            return submissionTime >= startTimestamp && submission.verdict === "OK";
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

        const p2Response = await axios.get(`https://codeforces.com/api/user.status?handle=${cfid2}`);
        if (p2Response.data.status !== "OK") {
            throw new Error("Failed to fetch submissions from Codeforces for Player 2");
        }
        const p2Submissions = p2Response.data.result;

        const p2ValidSubmissions = p2Submissions.filter(submission => {
            const submissionTime = submission.creationTimeSeconds * 1000;
            return submissionTime >= startTimestamp && submission.verdict === "OK";
        });

        match.problemList = problemList.map(problem => {
            const p1Solved = p1ValidSubmissions.find(submission =>
                submission.problem.contestId === problem.question.contestId &&
                submission.problem.index === problem.question.index
            );

            const p2Solved = p2ValidSubmissions.find(submission =>
                submission.problem.contestId === problem.question.contestId &&
                submission.problem.index === problem.question.index
            );

            let solvedBy = null;
            if (p1Solved && p2Solved) {
                solvedBy = p1Solved.creationTimeSeconds < p2Solved.creationTimeSeconds ? cfid1 : cfid2;
            } else if (p1Solved) {
                solvedBy = cfid1;
            } else if (p2Solved) {
                solvedBy = cfid2;
            }

            return {
                ...problem,
                solved: solvedBy
            };
        });

        await tournament.save();

        // req.io.to(`match_${matchId}`).emit("problemListUpdated", {
        //     matchId,
        //     problemList: match.problemList
        // });

        res.json(new ApiResponse(200, "Problem List Updated!", match.problemList));

    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiResponse(500, "Server Error!"));
    }
});

export const populateQuestions = asyncHandler(async (req, res) => {
    try {
        await Question.deleteMany({})

        const response = await axios.get('https://codeforces.com/api/problemset.problems');

        if (response.data.status === 'OK') {
            const problems = response.data.result.problems;

            const questionsToInsert = problems
                .filter(problem => problem.rating && typeof problem.rating === 'number')
                .map(problem => ({
                    contestId: problem.contestId,
                    index: problem.index,
                    name: problem.name,
                    rating: problem.rating
                }));

            const result = await Question.insertMany(questionsToInsert);

            const info = {
                totalQuestions: await Question.countDocuments(),
                r800: await Question.countDocuments({ rating: 800 }),
                r900: await Question.countDocuments({ rating: 900 }),
                r1000: await Question.countDocuments({ rating: 1000 }),
                r1100: await Question.countDocuments({ rating: 1100 }),
                r1200: await Question.countDocuments({ rating: 1200 }),
                r1300: await Question.countDocuments({ rating: 1300 }),
                r1400: await Question.countDocuments({ rating: 1400 }),
                r1500: await Question.countDocuments({ rating: 1500 }),
                r1600: await Question.countDocuments({ rating: 1600 }),
                r1700: await Question.countDocuments({ rating: 1700 }),
                r1800: await Question.countDocuments({ rating: 1800 }),
                r1900: await Question.countDocuments({ rating: 1900 }),
                r2000: await Question.countDocuments({ rating: 2000 }),
            }

            return res
                .status(201)
                .json(new ApiResponse(201, "questions populated successfully.", info))
        } else {
            return res
                .status(500)
                .json(new ApiResponse(500, 'Failed to retrieve problems from Codeforces API'))
        }
    } catch (error) {
        res.status(501)
        res.json(new ApiResponse(501, "Error while populating questions.", error))
    }
})

export const generateProblemList = asyncHandler(async (req, res) => {
    try {
        let { startingRating } = req.body;
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

            selectedQuestions.push(question[0]);
        }

        return res
            .status(201)
            .json(new ApiResponse(201, "Problem list generated successfully.", selectedQuestions));
    } catch (error) {
        return res
            .status(501)
            .json(new ApiResponse(501, "Error while generating Problem List.", error.message));
    }
});
