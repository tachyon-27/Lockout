import Tournament from "../../models/tournament.model.js";
import { UpdateProblemStatus } from "./UpdateProblemStatus.js";

export const handleMatchEnd = async (tournamentId, match, io, roomId, roomTimers, winner) => {
    try {

        const updatedMatchData = await UpdateProblemStatus(tournamentId, match);

        if (!updatedMatchData.success) {
            return io.to(roomId).emit("match-status", {
                success: false,
                message: "Failed to update match scores"
            });
        }

        const { participantPoints } = updatedMatchData;
        const cfid1 = match.participants[0].cfid;
        const cfid2 = match.participants[1].cfid;

        const p1Points = participantPoints[cfid1] || 0;
        const p2Points = participantPoints[cfid2] || 0;

        let resultText = "DRAW";

        if (!winner) {
            if (p1Points > p2Points) {
                winner = match.participants[0];
                resultText = "WON";
            } else if (p2Points > p1Points) {
                winner = match.participants[1];
                resultText = "WON";
            }
        } else {
            resultText = "WON";
        }

        const tournament = await Tournament.findById(tournamentId);

        if (winner) {
            if (match.nextMatchId) {
                const nextMatch = tournament.matches.find(m => m.id == match.nextMatchId);
                if (nextMatch) {
                    nextMatch = nextMatch.toObject();
                    nextMatch.participants = nextMatch.participants.filter(participant =>
                        participant.cfid !== match.participants[0].cfid &&
                        (match.participants.length <= 1 || participant.cfid !== match.participants[1].cfid)
                    );

                    if (!nextMatch.participants.some(p => p.cfid === winner.cfid)) {
                        nextMatch.participants.push(winner?.toObject ? winner.toObject() : winner);
                    }

                    nextMatch.participants = nextMatch.participants.filter((participant, index, self) =>
                        index === self.findIndex((p) => p.cfid === participant.cfid)
                    );

                    await Tournament.updateOne(
                        { _id: tournamentId },
                        {
                            $set: {
                                "matches.$[matchElem].participants.$[partElem]": nextMatch.participants[nextMatch.participants.length - 1],
                            }
                        },
                        {
                            arrayFilters: [
                                { "matchElem.id": nextMatch.id }, 
                                { "partElem.cfid": nextMatch.participants[nextMatch.participants.length - 1].cfid }
                            ]
                        }
                    );

                }
            }

            match.participants.find(p => p.cfid === winner.cfid).resultText = resultText;
        } else {
            match.participants[0].resultText = "TIE";
            match.participants[1].resultText = "TIE";
        }

        match.endTime = Date.now()
        match.state = "DONE";
        match.winner = winner ? winner.cfid : "DRAW";

        await Tournament.updateOne(
            { _id: tournamentId },
            {
                $set: {
                    "matches.$[matchElem].participants.$[partElem0].totalPoints": match.participants[0].totalPoints,
                    "matches.$[matchElem].participants.$[partElem0].resultText": match.participants[0].resultText,
                    "matches.$[matchElem].participants.$[partElem1].totalPoints": match.participants[1].totalPoints,
                    "matches.$[matchElem].participants.$[partElem1].resultText": match.participants[1].resultText,
                    "matches.$[matchElem].endTime": Date.now(),
                    "matches.$[matchElem].state": "DONE",
                    "matches.$[matchElem].winner": winner ? winner.cfid : "DRAW"
                }
            },
            {
                arrayFilters: [
                    { "matchElem.id": match.id },
                    { "partElem0.cfid": match.participants[0].cfid },
                    { "partElem1.cfid": match.participants[1].cfid },
                ],
                new: true
            }
        );

        if (roomTimers.has(roomId)) {
            clearTimeout(roomTimers.get(roomId));
            roomTimers.delete(roomId);
        }

        io.to(roomId).emit("match-status", {
            success: true,
            status: "DONE",
            finalMatchScore: updatedMatchData.participantPoints,
            match,
            winner: winner ? winner.cfid : "DRAW"
        });

    } catch (error) {
        console.error("Error ending match:", error);
        io.to(roomId).emit("match-status", {
            success: false,
            message: "Unexpected error while ending match"
        });
    }
};
