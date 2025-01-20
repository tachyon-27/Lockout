import { MagicCard } from "@/components/ui/magic-card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";

export function Tournament() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const getTournaments = async () => {
      try {
        const res = await axios.get("/api/tournament/tournaments");

        console.log(res.data.data);
        setTournaments(res.data.data);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message,
        });
      }
    };
    getTournaments();
  }, []);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {tournaments.map((tournament, idx) => (
    <MagicCard
      key={idx}
      className="relative h-[50vh] w-full cursor-pointer p-4 bg-black text-white shadow-2xl"
    >
      <div className="break-all w-full h-full min-w-full gap-y-3 grid grid-cols-1 grid-rows-6">
        <div className="text-3xl font-bold">{tournament.title}</div>

        <div className=" mt-4 text-lg row-span-4">
          {tournament.summary}
        </div>

        <div className="w-full flex justify-between items-center">
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            onClick={() => navigate(`/tournament/view?id=${tournament._id}`, { state: { from: location.pathname } })}
          >
            View
          </button>
          <button
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            onClick={() => navigate(`/register/${tournament._id}`)}
          >
            Register
          </button>
        </div>
      </div>
    </MagicCard>
  ))}
</div>


  );
}
