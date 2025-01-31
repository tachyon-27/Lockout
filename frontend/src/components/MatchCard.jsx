import React, { useEffect, useState } from "react";

const ShowStatus = ({ status }) => {
    const bgColor = {
        Upcoming: "#DB2137",
        Finished: "#0DAC13",
        Running: "#FFBB0E",
    };

    return (
        <div className="text-white sm:text-xs md:text-sm rounded-md w-fit p-1 px-2 font-semibold" style={{ backgroundColor: bgColor[status] }}>
            {status}
        </div>
    );
};

const MatchCard = () => {

    const [timeLeft, setTimeLeft] = useState(null);


    // Dummy Data
    const match = {
        title: "Championship Finals",
        startTime: "2025-12-30T09:42:00", // ISO format
        status: "Upcoming",
        players: ["Player A", "Player B"],
        remainingTime: "30 min",
    };
    
    useEffect(() => {
        if (!match?.startTime) return;
    
        const timer = setInterval(() => {
            const time = calculateTimeLeft(new Date(match.startTime));
            setTimeLeft(time);
        }, 1000);
    
        return () => clearInterval(timer);
    }, [match.startTime]);
    
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
            {/* Match Title & Status */}
            <div className="flex justify-between items-center mb-2 pb-2 border-b-2 border-slate-700">
                <h3 className="text-lg font-semibold">{match.title}</h3>
                <ShowStatus status={match.status} />
            </div>

            {/* Players */}
            <div className="text-center flex justify-between text-gray-300 font-medium mb-2 p-10">
                <div>{match.players[0]}</div> <div>Vs</div> <div>{match.players[1]}</div>
            </div>

            {/* Separator Line */}
            <div className="w-full h-[2px] bg-slate-500 my-2"></div>

            {/* Match Time / Remaining Time */}
            <div className="text-center text-gray-600 text-sm mb-4">
                {match.status === "Running" ? `Remaining: ${match.remainingTime}` : match.status === "Finished" ? "Match Ended" : `Starts in: ${formatTime(timeLeft)}`}
            </div>

            {/* Enter Button */}
            {status == "Running" ? (<button
                className={`w-full py-2 rounded-md font-semibold text-white 
                ${match.status === "Running" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
                disabled={match.status !== "Running"}
            >
                Enter
            </button>) : (
                <></>
            )}
        </div>
    );
};

export default MatchCard;
