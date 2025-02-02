// https://github.com/g-loot/react-tournament-brackets?tab=readme-ov-file#basic-usage
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"
import { RingLoader } from 'react-spinners';
import axios from "axios";
import {
  SingleEliminationBracket,
  Match,
} from "@g-loot/react-tournament-brackets";

function Fixtures() {
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get("id");
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast()
  const navigate = useNavigate()

  console.log(tournamentId)

  useEffect(() => {
    console.log("Hello");
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
        setMatches(response.data.data);
        console.log(response.data.data)
        setIsLoading(false);
      } catch (error) {
        navigate('/tournaments')
        toast({
          title: "Error Fetching matches!"
        })
        console.error("Error fetching matches:", error);
      }
    };

    (async () => await fetchMatches())();
  }, [navigate, toast, tournamentId]);

  if(isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RingLoader size={100} color="#36D7B7" />
      </div>
    );
  }
  

  return (
    <div className="overflow-x-auto p-4 rounded-lg">
      <div className="inline-block min-w-max">
        <SingleEliminationBracket
          matches={matches}
          matchComponent={Match}    
        /> 
      </div>
    </div>
  );
}

export default Fixtures;
