import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // To access query parameters
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { RingLoader, ScaleLoader } from "react-spinners";

const ViewTournament = () => {
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get("id");
  const [tournament, setTournament] = useState(null); // State to store the fetched tournament data
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!tournamentId) {
      console.error("Tournament ID is required in the query parameters.");
      return;
    }

    const fetchTournament = async () => {
      try {
        const response = await fetch(`/api/tournaments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: tournamentId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tournament data.");
        }

        const data = await response.json();
        setTournament(data);

        const eventStart = new Date(`${data.startDate}T${data.startTime}`);
        setTimeLeft(calculateTimeLeft(eventStart));
      } catch (error) {
        console.error("Error fetching tournament data:", error);
      }
    };

    fetchTournament();
  }, [tournamentId]);

  useEffect(() => {
    if (!timeLeft || !tournament) return;

    const timer = setInterval(() => {
      const eventStart = new Date(`${tournament.startDate}T${tournament.startTime}`);
      setTimeLeft(calculateTimeLeft(eventStart));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, tournament]);

  function formatTime(time) {
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

  if (!tournament) {
    return (
      <div className="flex items-center justify-center">
        <RingLoader size={100} color="#2563EB" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-y-4">
      <div className="text-3xl text-white">{tournament.title}</div>

      <div className="text-white text-xl p-4 bg-gray-900 rounded-2xl border border-gray-700">
        {timeLeft?.total > 0 ? (
          <>
            Countdown to Tournament Start: <strong>{formatTime(timeLeft)}</strong>
          </>
        ) : (
          <strong>The tournament has started!</strong>
        )}
      </div>

      {tournament.coverImage && (
        <div className="flex justify-center">
          <img
            src={tournament.coverImage}
            alt="Tournament Cover"
            className="rounded-lg shadow-lg w-full h-64 object-cover"
          />
        </div>
      )}


      <div className="flex justify-center items-center">
        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          className="dark:bg-gray-900 bg-white text-black dark:text-white flex self-center items-center space-x-2 justify-center mx-auto"
        >
          <span>Register</span>
        </HoverBorderGradient>
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: tournament.description }}
        className="text-white text-lg"
      ></div>
    </div>
  );
};

export default ViewTournament;
