import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

const Match = () => {

    const { toast } = useToast();

    const [searchParams] = useSearchParams()
    const matchId = searchParams.get('match')
    const tournamentId = searchParams.get('tournament')

    const navigate = useNavigate()

    // const [matchData, setMatchData] = useState()

    // useEffect(() => {

    //     if(!matchId || !tournamentId) {
    //         toast({
    //             title: "Match or Tournament not specified!"
    //         })
    //         navigate('/tournaments')
    //     }

    //     try {

    //         const getMatch = async () => {
    //             const response = await axios.get('/api/cf/get-match', {
    //                 tournamentId,
    //                 matchId,
    //            })

    //            if(!response.data.success === 'OK') {
    //             toast({
    //                 title: "Error Fetching questions!"
    //             })
    //             console.log(response.data);
    //             navigate('/tournaments')
    //            }

    //             setMatchData(response.data.data);

    //         }

    //         getMatch()

    //     } catch (error) {
    //         console.error(error);

    //         toast({
    //             title: "Error!"
    //         })

    //         navigate('/tournaments')

    //     }
    // }, [toast, tournamentId, matchId, navigate])

    // const handleSubmit = async () => {
    //     try {
    //         await axios.get('/api/cf/update-match-problems', {
    //             tournamentId,
    //             matchId,
    //         })
    //     } catch (error) {
    //         console.error(error);
    //         toast({
    //             title: "Error Updating problem Status!",
    //         })
    //     }
    // }

    // useEffect(() => {
    //     socket.on("problemListUpdated", (data) => {
    //         if(data.matchId === matchId) {
    //             setProblemList(data.problemList);
    //         } else {
    //             console.log("Event Emmited to wrong room!")
    //         }
    //     })

    //     return () => {
    //         socket.off("problemListUpdated");
    //     }

    // }, []);

    const matchData = {
        id: 1,
        name: "Grand Finale",
        nextmatchId: null,
        tournamentRoundText: 1,
        startTime: new Date('2025-02-01T21:00:00').toISOString(),
        state: "Running",
        duration: 1500,
        problemList: [
            { question: { contestId: 2023, index: "A", name: "temp" }, points: 100 , solved: "luv29"},
            { question: { contestId: 2023, index: "B", name: "temp" }, points: 200 , solved: "kunj_30"},
            { question: { contestId: 2023, index: "C", name: "temp" }, points: 300 },
            { question: { contestId: 2023, index: "D", name: "temp" }, points: 400 },
            { question: { contestId: 2023, index: "E", name: "temp" }, points: 500 },
        ],
        participants: [
            { cfid: "luv29", },
            { cfid: "kunj_30", },
        ],
    };

    const calculateTimeLeft = () => {
        const start = new Date(matchData.startTime).getTime();
        const now = new Date().getTime();
        const timePassed = now - start;
        const timeRemaining = matchData.duration * 60 * 1000 - timePassed;
        return Math.max(timeRemaining, 0); // Avoid negative time
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const interval = setInterval(() => {
            const updatedTimeLeft = calculateTimeLeft();
            setTimeLeft(updatedTimeLeft);
            if (updatedTimeLeft <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (timeInMillis) => {
        const minutes = Math.floor(timeInMillis / 60000);
        const seconds = Math.floor((timeInMillis % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    const renderProblemStatus = (solved, problem) => {
        return solved ? "✔️" : problem.points;
    };

    return (
        <div className="bg-cover bg-center opacity-70" style={{ backgroundImage: "url('../../../public/matchbg.jpg')" }}>
            <div className="p-4 flex flex-col items-center min-h-screen bg-black/30">
                <div className="text-white text-4xl font-bold">Round {matchData.tournamentRoundText}</div>
                <div className="text-white text-lg font-semibold">Time: {formatTime(timeLeft)}</div>

                <div className="flex min-w-full text-white pt-7">
                    <div className="w-[25%] flex flex-col items-center gap-y-3">
                        <span className="text-4xl">{matchData.participants[0].cfid}</span>
                        <span>Total Points: </span>
                    </div>

                    <div className="flex flex-grow items-center justify-center pt-[8%]">
                        {/* Table-like structure */}
                        <div className="flex flex-col w-[90%] justify-center">
                            {matchData.problemList.map((problem, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2 px-4 border-b border-white hover:bg-gray-700">
                                    <div className="w-[20%] text-center">{
                                        problem.solved ? (
                                            renderProblemStatus(problem.solved === matchData.participants[0].cfid, problem)
                                        ) : (problem.points)
                                    }</div>
                                    <div className="w-[60%] text-center">{problem.question.name || problem.question.index}</div>
                                    <div className="w-[20%] text-center">{
                                        problem.solved ? (
                                            renderProblemStatus(problem.solved === matchData.participants[1].cfid, problem)
                                        ) : (problem.points)
                                    }</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-[25%] flex flex-col items-center gap-y-3">
                        <span className="text-4xl">{matchData.participants[1].cfid}</span>
                        <span>Total Points: </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Match