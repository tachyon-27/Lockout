import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { socket } from "../../socket";
import {
    Loader,
    MatchSettings
} from "@/components";

const Match = ({ isAdmin }) => {
    const { toast } = useToast();
    const [searchParams] = useSearchParams()
    const matchId = searchParams.get('matchId')
    const tournamentId = searchParams.get('tournamentId')
    const navigate = useNavigate()
    const [matchData, setMatchData] = useState({ tieBreakers: [] });
    const [totalPoints, setTotalPoints] = useState()
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRefreshActive, setIsRefreshActive] = useState(true);
    const [openMatchSettings, setOpenMatchSettings] = useState(false);

    const calculateTimeLeft = () => {
        const start = new Date(matchData.startTime).getTime();
        const now = new Date().getTime();
        if (matchData.endTime) {
            const end = new Date(matchData.endTime).getTime();
            if (now >= new Date(matchData.endTime).getTime()) {
                return 0;
            }
        }
        const timePassed = now - start;
        const timeRemaining = matchData.duration * 60 * 1000 - timePassed;
        return Math.max(timeRemaining, 0);
    };

    // Refresh Problem Status Button
    const handleProblemRefresh = async () => {
        setIsRefreshActive(false);
        try {
            const response = await axios.post(`/api/cf/update-match-problems`, {
                tournamentId,
                matchId,
            });

            if (response.data.success) {
                setMatchData(prevMatchData => ({
                    ...prevMatchData,
                    problemList: response.data.data.problemList
                }));
                setTotalPoints(response.data.data.participantPoints);
                toast({
                    title: "Problem Status Updated!"
                })
            } else {
                console.log(response.data);
                toast({
                    title: response.data.message,
                });
            }
        } catch (error) {
            toast({
                title: "Server Error while updating problem Status!",
                description: "Contact Administrator!"
            });
            console.log(error);
        } finally {
            setIsRefreshActive(true);
        }
    };

    // Join Match
    useEffect(() => {
        if (!matchId || !tournamentId) {
            toast({
                title: "Match or Tournament not specified!"
            })
            navigate('/tournaments')
            return;
        }

        try {
            const getMatch = async () => {
                try {
                    const response = await axios.post('/api/tournament/get-match', {
                        _id: tournamentId,
                        matchId
                    });
                    if (response.data.success) {
                        setMatchData(response.data.data);
                        setTotalPoints({
                            [response.data.data.participants[0].cfid]: response.data.data.participants[0].totalPoints | 0,
                            [response.data.data.participants[1].cfid]: response.data.data.participants[1].totalPoints | 0,
                        })

                        if (response.data.data?.state === "SCHEDULED" && isAdmin) setOpenMatchSettings(true);

                        socket.emit("joinRoom", `${tournamentId}_${matchId}`);
                    } else {
                        toast({
                            title: "Error Fetching Questions"
                        });
                        console.log(response.data);
                        navigate('/tournaments');
                    }
                } catch (error) {
                    console.error(error);
                    toast({ title: "Error fetching match details!" });
                    navigate('/tournaments');
                } finally {
                    setIsLoading(false);
                }
            };

            getMatch()
        } catch (error) {
            console.error(error);
            toast({
                title: "Error!"
            })

            navigate('/tournaments')
        }

        return () => {
            socket.emit("leaveRoom", `${tournamentId}_${matchId}`);
        };

    }, [])

    // Update problemList
    useEffect(() => {
        const handleMatchStatus = (data) => {
            console.log(data)
            if (data.success) {
                if (data.status === "RUNNING") {
                    setMatchData((prevMatchData) => ({
                        ...prevMatchData,
                        problemList: data.updatedMatchScore.problemList,
                    }));
                    setTotalPoints(data.updatedMatchScore.participantPoints);
                } else if (data.status === "DONE") {
                    setMatchData(data.match);
                    setTotalPoints(data.finalMatchScore);
                } else if (data.status === "BYE") {
                    setMatchData(data.match)
                }
            } else {
                toast({
                    title: data.message,
                });
            }
        };

        socket.on("match-status", handleMatchStatus);

        return () => {
            socket.off("match-status", handleMatchStatus);
        };
    }, []);

    // TieBreaker
    useEffect(() => {
        const handleTieBreakerUpdate = (data) => {
            console.log("TieBreaker Updated:", data);
            if (data.success) {
                setMatchData((prevMatchData) => ({
                    ...prevMatchData,
                    tieBreakers: data.tieBreakers,
                }));
            }
        };

        socket.on("tieBreakerUpdated", handleTieBreakerUpdate);

        return () => {
            socket.off("tieBreakerUpdated", handleTieBreakerUpdate);
        };
    }, []);


    useEffect(() => {
        const handleMatchStart = (data) => {
            console.log(data)
            try {
                setMatchData(data)
            } catch (error) {
                console.log(error)
                toast({
                    title: "Error While starting match!"
                })
            }
        }

        socket.on("match-start", handleMatchStart);

        return () => {
            socket.off("match-start", handleMatchStart);
        };

    }, [])

    socket.on('add-duration', (data) => { setMatchData(data); console.log(data) })

    // Timer
    useEffect(() => {
        console.log(timeLeft);
        const interval = setInterval(() => {
            const updatedTimeLeft = calculateTimeLeft();
            setTimeLeft(updatedTimeLeft);
            if (updatedTimeLeft <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [matchData]);

    const formatTime = (timeInMillis) => {
        const minutes = Math.floor(timeInMillis / 60000);
        const seconds = Math.floor((timeInMillis % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    const renderProblemStatus = (solved, problem) => {
        return solved ? "✔️" : problem.points;
    };

    const handleRemoveTieBreaker = async (questionId) => {
        const confirmRemove = window.confirm("Are you sure you want to remove this tie-breaker?");
        if (!confirmRemove) return;

        try {
            const response = await axios.post("/api/tournament/remove-tie-breaker", {
                tournamentId,
                matchId,
                questionId,
            });

            if (response.data.success) {
                setMatchData((prevMatchData) => {
                    console.log(prevMatchData);
                    console.log(matchData);
                    return {
                    ...prevMatchData,
                    tieBreakers: prevMatchData.tieBreakers.filter((tb) => tb._id !== questionId),
                }});
                toast({ title: "Tie-breaker removed successfully!" });
            } else {
                toast({ title: response.data.message });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Error removing tie-breaker. Try again later!" });
        }
    };


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader />
            </div>
        );
    }

    return (
        <div className="p-4 flex flex-col items-center min-h-full">
            {matchData.winner && (
                <div className="text-white text-2xl font-semibold">
                    {matchData.winner === "DRAW" ? "It is a Tie" : `${matchData.winner} won the Match`}
                </div>
            )}
            <div className="text-white text-4xl font-bold">Round {matchData.tournamentRoundText}</div>
            <div className="text-white text-lg font-semibold">{matchData?.state !== "DONE" ? (timeLeft > 0 ? <span>Time: {formatTime(timeLeft)}</span> : <></>) : <span>Match Ended</span>}</div>

            <div className="flex justify-between flex-wrap min-w-full order-1 text-white pt-7">
                <div className="w-[25%] flex flex-col items-center gap-y-3">
                    <span className="text-4xl">{matchData.participants[0].cfid}</span>
                    <span>Total Points: {totalPoints[matchData.participants[0].cfid]}</span>
                </div>

                <div className="md:w-[50%] text-center w-full order-3 md:order-2 flex flex-grow items-center justify-center pt-[30%] md:pt-[8%]">
                    <div className="flex flex-col w-[90%] justify-center">
                        {openMatchSettings ?
                            <MatchSettings setOpenMatchSettings={setOpenMatchSettings} />
                            :
                            <div>
                                {matchData.problemList && matchData.problemList.map((problem, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-2 px-4 border-b border-white hover:bg-gray-700">
                                        <div className="w-[20%] text-center">{
                                            problem.solved ? (
                                                renderProblemStatus(problem.solved === matchData.participants[0].cfid, problem)
                                            ) : (problem.points)
                                        }</div>
                                        <div className="w-[60%] text-center">
                                            <a
                                                href={`https://codeforces.com/contest/${problem.question.contestId}/problem/${problem.question.index}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-yellow-300 hover:underline"
                                            >
                                                {problem.question.name || problem.question.index}
                                            </a>
                                        </div>
                                        <div className="w-[20%] text-center">{
                                            problem.solved ? (
                                                renderProblemStatus(problem.solved === matchData.participants[1].cfid, problem)
                                            ) : (problem.points)
                                        }</div>
                                    </div>
                                ))}
                            </div>
                        }
                        <div className="flex justify-around">
                            <button
                                className="w-[30%] self-center mt-2 p-2 font-semibold bg-gray-700 hover:bg-gray-600 disabled:bg-gray-500 text-white rounded-xl"
                                onClick={handleProblemRefresh}
                                disabled={!isRefreshActive}
                            >
                                {isRefreshActive ? <span>Refresh Status</span> : <span>Please Wait...</span>}
                            </button>

                            {isAdmin && (
                                <button
                                    className="w-[30%] self-center mt-2 p-2 font-semibold bg-gray-700 hover:bg-gray-600 disabled:bg-gray-500 text-white rounded-xl"
                                    onClick={() => setOpenMatchSettings(!openMatchSettings)}
                                >
                                    Settings
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-[25%] order-2 md:order-3 flex flex-col items-center gap-y-3">
                    <span className="text-4xl">{matchData.participants[1].cfid}</span>
                    <span>Total Points: {totalPoints[matchData.participants[1].cfid]}</span>
                </div>
            </div>
            {!openMatchSettings && matchData.tieBreakers && matchData.tieBreakers.length > 0 && (
                <div className="w-full mt-6 p-4 order-4 text-white rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-center">Tie Breaker Questions</h2>
                    <div className="mt-4 space-y-3">
                        {matchData.tieBreakers.map((tb, idx) => (
                            <div key={idx} className="p-3 bg-gray-700 rounded-lg border border-gray-600 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-yellow-300">{tb.title}</h3>
                                    <p className="text-gray-300">{tb.question}</p>
                                </div>
                                {isAdmin && (
                                    <button
                                        className="ml-4 text-red-500 hover:text-red-700"
                                        onClick={() => handleRemoveTieBreaker(tb._id)}
                                    >
                                        ❌
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Match