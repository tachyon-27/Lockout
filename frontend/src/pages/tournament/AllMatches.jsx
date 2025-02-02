import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"
import axios from "axios";
import MatchCard from '@/components/MatchCard'

const AllMatches = () => {
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get("id");
  const [matches, setMatchs] = useState([])
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
        setMatchs(response.data.data.filter(match => match.participants.length === 2));
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



  return (
    <div className='p-2 md:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {matches.map((match, idx) => (
        <div key={idx}>
          <MatchCard tournamentId={tournamentId} match={match} />
        </div>
      ))}
    </div>
  )
}

export default AllMatches
