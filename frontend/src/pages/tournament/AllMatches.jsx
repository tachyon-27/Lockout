import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"
import axios from "axios";
import MatchCard from '@/components/MatchCard'

const AllMatches = ({isAdmin = false}) => {
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get("id");
  const [matches, setMatchs] = useState([])
  const [show, setShow] = useState(false)
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
      try {
        const response = await axios.post(`/api/tournament/get-matches`, {
          _id: tournamentId
        });

        if (!response.data.success) {
          throw new Error("Failed to fetch matches.");
        }
        setStartDate(response.data.data.startDate)
        setShow(response.data.data.show)
        setMatchs(response.data.data.matches.filter(match => match.participants.length === 2));
        console.log(response.data.data)
      } catch (error) {
        navigate('/tournaments')
        toast({
          title: "Error Fetching matches!"
        })
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, []);

  const filteredMatches = useMemo(() => {
    return {
      upcomingMatches: matches.filter((match) => match.state === "SCHEDULED"),
      ongoingMatches: matches.filter((match) => match.state === "RUNNING"),
      pastMatches: matches.filter((match) => match.state === "DONE")
    };
  }, [matches]);

  return (!show || matches.length === 0 || new Date(startDate) > new Date()) ? (
    <div className=' w-full h-full flex items-center justify-center text-2xl'>
      No matches available yet.
    </div>
  ) : (
    <div className='p-2 md:p-5'>
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
          {  filteredMatches.upcomingMatches.map((match, idx) => (
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
