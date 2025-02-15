import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"
import { RingLoader } from "react-spinners";
import axios from "axios";
import { RegistrButton } from "@/components";

const ViewTournament = () => {
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get("id");
  const [tournament, setTournament] = useState(null); 
  const [timeLeft, setTimeLeft] = useState(null);
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!tournamentId) {
      console.log("Tournament ID is required in the query parameters.");
      toast({
        title: "Tournament not Specified!"
      })
      navigate('/tournaments');
      return;
    }

    const fetchTournament = async () => {
      try {
        const response = await axios.post(`/api/tournament/get-tournament`, {
          _id: tournamentId
        });

        if (!response.data.success) {
          throw new Error("Failed to fetch tournament data.");
        }
        setTournament(response.data.data);

        setTimeLeft(calculateTimeLeft(new Date(response.data.data.startDate)));
      } catch (error) {
        navigate('/')
        toast({
          title: "Error Fetching Tournament Data!"
        })
        console.error("Error fetching tournament data:", error);
      }
    };

    fetchTournament();
  }, [tournamentId, navigate, toast]);

  useEffect(() => {
    if (!timeLeft || !tournament) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(new Date(tournament.startDate)));
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
        <RegistrButton tournamentId={tournamentId}/>
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: tournament.description }}
        className="text-white"
      ></div>
    </div>
  );
};

export default ViewTournament;
