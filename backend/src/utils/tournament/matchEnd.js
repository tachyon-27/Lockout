import { UpdateProblemStatus } from "./UpdateProblemStatus.js";

export const handleMatchEnd = async (tournament, match, io, roomId, winner) => {
    try {
        
        const updatedMatchData = await UpdateProblemStatus(tournament, match);
        
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

        if(!winner) {
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

        if (winner) {
            if (match.nextMatchId) {
                const nextMatch = tournament.matches.find(m => m.id == match.nextMatchId);
                if (nextMatch) {
                    nextMatch.participants = nextMatch.participants.filter(participant => {
                        participant.cfid != match.participants[0].cfid && match.participants.length > 1 && participant.cfid != match.participants[1].cfid
                        if(match.participants[0].cfid === participant.cfid) return false;
                        else {
                            if(match.participants.length > 1) {
                                if(match.participants[1].cfid === participant.cfid) return false;
                                else return true;
                            } else return true;
                        }
                    } )
                    nextMatch.participants.push(winner);
                }
            }

            match.participants.find(p => p.cfid === winner.cfid).resultText = resultText;
        } else {
            match.participants[0].resultText = "TIE";
            match.participants[1].resultText = "TIE";
        }

        match.endTime = Date.now()
        match.state = "DONE";

        await tournament.save();

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
