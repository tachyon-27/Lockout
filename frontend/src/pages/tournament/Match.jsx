import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { socket } from "../../socket";

const Match = () => {
    const { toast } = useToast();
    const [searchParams] = useSearchParams()
    const matchId = searchParams.get('matchId')
    const tournamentId = searchParams.get('tournamentId')
    const navigate = useNavigate()
    const [matchData, setMatchData] = useState({})
    const [totalPoints, setTotalPoints] = useState()
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);

    const calculateTimeLeft = () => {
        const start = new Date(matchData.startTime).getTime();
        const now = new Date().getTime();
        const timePassed = now - start;
        const timeRemaining = matchData.duration * 60 * 1000 - timePassed;
        return Math.max(timeRemaining, 0);
    };

    // Join Match
    useEffect(() => {
        socket.connect()
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
                            [response.data.data.participants[0].cfid]: 0,
                            [response.data.data.participants[1].cfid]: 0,
                        })

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
            if (data.success) {
                if (data.status === "RUNNING") {
                    setMatchData((prevMatchData) => ({
                        ...prevMatchData,
                        problemList: data.updatedMatchScore.problemList,
                    }));
                    setTotalPoints(data.updatedMatchScore.participantPoints);
                } else if (data.status === "DONE") {
                    setMatchData((prevMatchData) => ({
                        ...prevMatchData,
                        problemList: data.finalMatchScore.problemList,
                    }));
                    setTotalPoints(data.finalMatchScore.participantPoints);
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
    }, [toast]);
    
    

    useEffect(() => {
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

    if (isLoading) {
        return (<></>);
    }

    return (
        <div className="bg-cover bg-center opacity-70" style={{ backgroundImage: "url('../../../public/matchbg.jpg')" }}>
            <div className="p-4 flex flex-col items-center min-h-screen bg-black/30">
                <div className="text-white text-4xl font-bold">Round {matchData.tournamentRoundText}</div>
                <div className="text-white text-lg font-semibold">Time: {formatTime(timeLeft)}</div>

                <div className="flex min-w-full text-white pt-7">
                    <div className="w-[25%] flex flex-col items-center gap-y-3">
                        <span className="text-4xl">{matchData.participants[0].cfid}</span>
                        <span>Total Points: {totalPoints[matchData.participants[0].cfid]}</span>
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
                                    <div className="w-[60%] text-center">
                                        <a
                                            href={`https://codeforces.com/contest/${problem.question.contestId}/problem/${problem.question.index}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
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
                    </div>

                    <div className="w-[25%] flex flex-col items-center gap-y-3">
                        <span className="text-4xl">{matchData.participants[1].cfid}</span>
                        <span>Total Points: {totalPoints[matchData.participants[1].cfid]}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Match