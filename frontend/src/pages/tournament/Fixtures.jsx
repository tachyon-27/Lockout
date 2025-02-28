// https://github.com/g-loot/react-tournament-brackets?tab=readme-ov-file#basic-usage
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"
import axios from "axios";
import {
  SingleEliminationBracket,
  Match,
} from "@g-loot/react-tournament-brackets";
import {Loader} from '@/components';
import { socket } from '../../socket';

function Fixtures() {
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get("id");
  const [matches, setMatches] = useState([])
  const [show, setShow] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!tournamentId) {
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
        setShow(response.data.data.show) 
        setMatches(response.data.data.matches);
        setIsLoading(false);
      } catch (error) {
        navigate('/tournaments')
        toast({
          title: "Error Fetching matches!"
        })
      }
    };

    (async () => await fetchMatches())();
  }, [navigate, toast, tournamentId]);

  useEffect(() => {
  
      const handleMatchesUpdate = (data) => setMatches(data.matches);
      const handleMatchShowHide = (data) => {
        setMatches(data.matches);
        setShow(data.showDetails);
      }
  
      socket.on('match-end', handleMatchesUpdate);
      socket.on('match-bye', handleMatchesUpdate);
      socket.on('tournament-show', handleMatchShowHide);
      socket.on('tournament-hide', handleMatchShowHide);
      socket.on('tournament-start', handleMatchShowHide);
      
      return () => {
        socket.off('match-end', handleMatchesUpdate);
        socket.off('match-bye', handleMatchesUpdate);
        socket.off('tournament-show', handleMatchShowHide);
        socket.off('tournament-hide', handleMatchShowHide);
        socket.off('tournament-start', handleMatchShowHide);
      }
  
    }, [])

  if(isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }
  

  return !show || !matches ? (
    <div className=' w-full h-full flex items-center justify-center text-2xl'>
      Fixtures not available yet.
    </div>
  ) : (
    <div className="overflow-x-auto p-4 rounded-lg transform sm:scale-100 xs:scale-80 scale-75">
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
