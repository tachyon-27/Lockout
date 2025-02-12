import axios from 'axios'
export const UpdateProblemStatus = async (tournament, match) => {
    try {
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

        let p1TotalPoints = 0;
        let p2TotalPoints = 0;

        match.problemList = problemList.map(problem => {
            const p1Solved = p1ValidSubmissions.find(submission =>
                String(submission.problem.contestId) === problem.question.contestId &&
                String(submission.problem.index) === problem.question.index
            );

            const p2Solved = p2ValidSubmissions.find(submission =>
                String(submission.problem.contestId) === problem.question.contestId &&
                String(submission.problem.index) === problem.question.index
            );

            let solvedBy = null;
            if (p1Solved && p2Solved) {
                solvedBy = p1Solved.creationTimeSeconds < p2Solved.creationTimeSeconds ? cfid1 : cfid2;
            } else if (p1Solved) {
                solvedBy = cfid1;
            } else if (p2Solved) {
                solvedBy = cfid2;
            }

            if (solvedBy === cfid1) {
                p1TotalPoints += problem.points;
            } else if (solvedBy === cfid2) {
                p2TotalPoints += problem.points;
            }

            return {
                ...problem,
                solved: solvedBy
            };
        });

        match.participants[0].totalPoints = p1TotalPoints;
        match.participants[1].totalPoints = p2TotalPoints;

        await tournament.save();

        return {
            success: true,
            problemList: match.problemList,
            participantPoints: {
                [cfid1]: match.participants[0].totalPoints,
                [cfid2]: match.participants[1].totalPoints,
            }
        };

    } catch (error) {
        console.error("UpdateProblemStatus Error:", error);
        return {
            success: false,
            message: "Unexpected error in score update",
            error,
        };
    }
}