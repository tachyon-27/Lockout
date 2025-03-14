import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"
import axios from "axios";
import { RegistrButton } from "@/components";
import {Loader} from "@/components";
import { useSelector } from "react-redux";
import { socket } from '../../socket';

const ViewTournament = () => {
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get("id");
  const [tournament, setTournament] = useState(null); 
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const isLoggedIn = useSelector(state => state.user.isAuthenticated);

  // Fetch Tournament on render
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
        let response, tournament;
        if(isLoggedIn) {
          response = await axios.post(`/api/tournament/get-tournament-user`, {
            _id: tournamentId
          });
          tournament = response.data.data.tournament;
          setIsRegistered(response.data.data.isRegistered)
        }
        else {
          response = await axios.post(`/api/tournament/get-tournament`, {
            _id: tournamentId
          });
          tournament = response.data.data;
        }

        if (!response.data.success) {
          throw new Error("Failed to fetch tournament data.");
        }
        setTournament(tournament);

        setTimeLeft(calculateTimeLeft(new Date(tournament.startDate)));
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
    const handleTournamentStart = (data) => {
      setTournament(data);
    };
  
    const handleTournamentEnd = (data) => {
      console.log("Tournament end");
      setTournament(data);
    };

    const handleTournamentUpdate = (data) => {
      setTournament(data);
    };
  
    socket.on('tournament-start', handleTournamentStart);
    socket.on('tournament-end', handleTournamentEnd);
    socket.on('tournament-update', handleTournamentUpdate);
    
    return () => {
      socket.off('tournament-start', handleTournamentStart);
      socket.off('tournament-end', handleTournamentEnd);
      socket.off('tournament-update', handleTournamentUpdate);
    };
  }, []); 

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
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
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
          <strong>The tournament has {tournament.endDate ? 'ended' : 'started'}!</strong>
        )}
      </div>

      {tournament.coverImage && (
        <div className="flex justify-center">
          <img
            src={tournament.coverImage}
            alt="Tournament Cover"
            className="min-w-full h-auto object-contain rounded-xl mb-4"
          />
        </div>
      )}


      <div className="flex justify-center items-center">
        {(timeLeft.total > 0) && 
          <RegistrButton tournamentId={tournamentId} isRegistered={isRegistered}/>
        }
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: tournament.description }}
        className="text-white space-y-4"
      ></div>
    </div>
  );
};

export default ViewTournament;
