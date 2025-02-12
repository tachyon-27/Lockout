export const handleMatchEnd = async (tournament, match, io, roomId) => {
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

        let winner = null;
        let resultText = "DRAW";

        if (p1Points > p2Points) {
            winner = match.participants[0];
            resultText = "WON";
        } else if (p2Points > p1Points) {
            winner = match.participants[1];
            resultText = "WON";
        }

        if (winner) {
            match.participants.find(p => p.cfid === winner.cfid).resultText = resultText;

            if (match.nextMatchId) {
                const nextMatch = tournament.matches.find(m => m.id == match.nextMatchId);
                if (nextMatch) {
                    nextMatch.participants.push(winner);
                }
            }
        }

        await tournament.save();

        io.to(roomId).emit("match-status", {
            success: true,
            status: "DONE",
            finalMatchScore: updatedMatchData,
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
