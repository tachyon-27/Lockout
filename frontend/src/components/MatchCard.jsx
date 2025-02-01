import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ShowStatus = ({ status }) => {
    const bgColor = {
        SCHEDULED: "#DB2137",
        DONE: "#0DAC13",
        RUNNING: "#FFBB0E",
    };

    return (
        <div className="text-white sm:text-xs md:text-sm rounded-md w-fit p-1 px-2 font-semibold" style={{ backgroundColor: bgColor[status] }}>
            {status}
        </div>
    );
};

const MatchCard = ({ match }) => {
    const [timeLeft, setTimeLeft] = useState(null);

    // const match = {
    //     tournamentRoundText: "Championship Finals",
    //     startTime: "2025-12-30T09:42:00", // ISO format
    //     state: "Upcoming",
    //     participants: ["Player A", "Player B"],
    //     matchTime: "30 min",
    // };
    
    useEffect(() => {
        if (!matchData?.startTime) return;

        const timer = setInterval(() => {
            const time = calculateTimeLeft(new Date(matchData.startTime));
            setTimeLeft(time);
        }, 1000);

        return () => clearInterval(timer);
    }, [matchData.startTime]);

    function formatTime(time) {
        if (!time) return "Loading...";
        return `${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`;
    }

    function calculateTimeLeft(eventStart) {
        const now = new Date();
        const difference = eventStart - now;

        return difference > 0
            ? {
                total: difference,
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            }
            : { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }


    return (
        <div className="p-4 border rounded-md shadow-md w-full bg-transparent bg-gradient-to-tr from-black via-gray-400/30 to-gray-500/50 transition-transform duration-300 hover:scale-105  hover:shadow-lg">
            {/* MatchData Title & Status */}
            <div className="flex justify-between items-center mb-2 pb-2 border-b-2 border-slate-700">
                <h3 className="text-lg font-semibold">{match.tournamentRoundText}</h3>
                <ShowStatus status={match.state} />
            </div>

            {/* Players */}
            <div className="text-center flex justify-between text-gray-300 font-medium mb-2 p-10">
                <div>{match.participants[0].cfid}</div> <div>Vs</div> <div>{match.participants[1].cfid}</div>
            </div>

            {/* Separator Line */}
            <div className="w-full h-[2px] bg-slate-500 my-2"></div>

            {/* MatchData Time / Remaining Time */}
            <div className="text-center text-gray-600 text-sm mb-4">
                {match.state === "RUNNING" ? `Remaining: ${match.matchTime}` : match.state === "DONE" ? "Match Ended" : `Starts in: ${formatTime(timeLeft)}`}
            </div>

            {/* Enter Button */}
            {match.state == "RUNNING" ? (<button
                className={`w-full py-2 rounded-md font-semibold text-white 
                ${match.state === "RUNNING" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
                disabled={match.state !== "RUNNING"}
            >
                Enter
            </button>) : (
                <></>
            )}
        </div>
    );
};

export default MatchCard;
