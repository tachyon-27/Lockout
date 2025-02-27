import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"
import axios from "axios";
import MatchCard from '@/components/MatchCard'
import { socket } from '../../socket';
import { Loader } from '@/components';

const AllMatches = ({ isAdmin = false }) => {
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get("id");
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false)
  const [searchKey, setSearchKey] = useState("");
  const [startDate, setStartDate] = useState(null);
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

    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`/api/tournament/get-matches`, {
          _id: tournamentId
        });

        if (!response.data.success) {
          throw new Error("Failed to fetch matches.");
        }
        setStartDate(response.data.data.startDate)
        setShow(response.data.data.show)
        setMatches(response.data.data.matches.filter(match => match.participants.length === 2));
        console.log(response.data.data.matches.filter(match => match.participants.length === 2));
      } catch (error) {
        navigate('/tournaments')
        toast({
          title: "Error Fetching matches!"
        })
        console.error("Error fetching matches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  useEffect(() => {

    const handleMatchesUpdate = (data) => setMatches(data.matches.filter(match => match.participants.length === 2));

    const handleMatchShowHide = (data) => {
      setMatches(data.matches);
      setShow(data.showDetails);
    }

    socket.on('match-start', handleMatchesUpdate);
    socket.on('match-end', handleMatchesUpdate);
    socket.on('match-bye', handleMatchesUpdate);
    socket.on('tournament-show', handleMatchShowHide);
    socket.on('tournament-hide', handleMatchShowHide);
    socket.on('tournament-start', handleMatchShowHide);


    return () => {
      socket.off('match-start', handleMatchesUpdate);
      socket.off('match-end', handleMatchesUpdate);
      socket.off('match-bye', handleMatchesUpdate);
      socket.off('tournament-show', handleMatchShowHide);
      socket.off('tournament-hide', handleMatchShowHide);
      socket.off('tournament-start', handleMatchShowHide);
    }

  }, [])

  const filteredMatches = useMemo(() => {
    const lowerSearch = searchKey.toLowerCase();
    const isNumericSearch = !isNaN(searchKey); // Check if searchKey is a number

    const filtered = matches
      .filter((match) =>
        match.participants[0].cfid.toLowerCase().includes(lowerSearch) ||
        match.participants[1].cfid.toLowerCase().includes(lowerSearch) ||
        match.tournamentRoundText == searchKey
      )
      .sort((a, b) => {
        const aCfidStarts = a.participants[0].cfid.toLowerCase().startsWith(lowerSearch);
        const bCfidStarts = b.participants[0].cfid.toLowerCase().startsWith(lowerSearch);

        if (aCfidStarts !== bCfidStarts) return aCfidStarts ? -1 : 1;

        if (isNumericSearch) {
          const aExactRound = a.tournamentRoundText == searchKey;
          const bExactRound = b.tournamentRoundText == searchKey;
          if (aExactRound !== bExactRound) return aExactRound ? -1 : 1;
        }

        return 0;
      });
    return {
      upcomingMatches: filtered.filter((match) => match.state === "SCHEDULED"),
      ongoingMatches: filtered.filter((match) => match.state === "RUNNING"),
      pastMatches: filtered.filter((match) => match.state === "DONE").reverse()
    };
  }, [matches, searchKey]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    )
  }

  return (!show || matches.length === 0 || new Date(startDate) > new Date()) ? (
    <div className=' w-full h-full flex items-center justify-center text-2xl'>
      No matches available yet.
    </div>
  ) : (
    <div className='flex flex-col p-2 md:p-5'>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => setSearchKey(e.target.value)}
        className="w-full md:w-[70%] self-center px-4 py-2 mb-9 text-white 
             bg-white/10 backdrop-blur-md border border-white/20
             rounded-lg outline-none transition-all duration-200 
             hover:bg-white/20 focus:ring-2 focus:ring-purple-500/50 
             placeholder-gray-300"
      />

      {
        filteredMatches.ongoingMatches.length !== 0 &&
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Ongoing Matches</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {
              filteredMatches.ongoingMatches.map((match, idx) => (
                <div key={idx}>
                  <MatchCard isAdmin={isAdmin} tournamentId={tournamentId} match={match} />
                </div>
              ))
            }
          </div>
        </section>
      }
      {isAdmin &&
        filteredMatches.upcomingMatches.length !== 0 &&
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Matches</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.upcomingMatches.map((match, idx) => (
              <div key={idx}>
                <MatchCard isAdmin={isAdmin} tournamentId={tournamentId} match={match} />
              </div>
            ))}
          </div>
        </section>

      }
      {filteredMatches.pastMatches.length !== 0 &&
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Past Matches</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.pastMatches.map((match, idx) => (
              <div key={idx}>
                <MatchCard isAdmin={isAdmin} tournamentId={tournamentId} match={match} />
              </div>
            ))
            }
          </div>
        </section>
      }
    </div>
  );
};


export default AllMatches
