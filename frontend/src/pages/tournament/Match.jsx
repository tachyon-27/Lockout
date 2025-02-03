import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

const Match = () => {
    const { toast } = useToast();
    const [searchParams] = useSearchParams()
    const matchId = searchParams.get('matchId')
    const tournamentId = searchParams.get('tournamentId')
    const navigate = useNavigate()
    const [matchData, setMatchData] = useState()
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    let running = 1;

    const calculateTimeLeft = () => {
        const start = new Date(matchData.startTime).getTime();
        const now = new Date().getTime();
        const timePassed = now - start;
        // console.log(timePassed)
        const timeRemaining = matchData.duration * 60 * 1000 - timePassed;
        // console.log(timeRemaining)
        return Math.max(timeRemaining, 0);
    };

    useEffect(() => {
        if (!matchId || !tournamentId) {
            toast({
                title: "Match or Tournament not specified!"
            })
            navigate('/tournaments')
        }

        try {
            const getMatch = async () => {
                const response = await axios.post('/api/tournament/get-match', {
                    _id: tournamentId,
                    matchId,
                })

                if (!response.data.success) {
                    toast({
                        title: "Error Fetching questions!"
                    })
                    console.log(response.data);
                    navigate('/tournaments')
                }
                setMatchData(response.data.data);
                console.log(response.data.data);
                setIsLoading(false);
            }

            getMatch()
        } catch (error) {
            console.error(error);
            toast({
                title: "Error!"
            })

            navigate('/tournaments')
        }
    }, [])

    // Update problemList
    useEffect(() => {
        console.log("Hi")
        const updateProblem = async () => {
            console.log("k")
            try {
                console.log("called!");
                const response = await axios.post(`/api/cf/update-match-problems`, {
                    tournamentId,
                    matchId,
                });
                
                if (response.data.success) {
                    setMatchData(prevMatchData => ({
                        ...prevMatchData,
                        problemList: response.data.data
                    }));
                    console.log(response.data.data)
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
            }
        };
        console.log(running);
        if (running > 0) {
            console.log("Hello")
            const interval = setInterval(() => {
                console.log("K");
                updateProblem()
            }, 10000);
            return () => {
                console.log("Clearing interval...");
                clearInterval(interval);
            };  // ✅ Clears interval properly on unmount
        }
    }, [tournamentId, toast]); // ✅ Removed `matchData` to prevent unnecessary re-renders
    

    useEffect(() => {
        const interval = setInterval(() => {
            const updatedTimeLeft = calculateTimeLeft();
            setTimeLeft(updatedTimeLeft);
            if (updatedTimeLeft <= 0) {
                running = 0;
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
                        <span>Total Points: </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Match