import { MagicCard } from "@/components/ui/magic-card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { TournamentRegister } from "@/components";
import {
  Modal,
  ModalTrigger,
} from "@/components/ui/animated-modal";

export default function Tournament({ isAdmin }) {
  if(!isAdmin) isAdmin = false;
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
  }, [toast]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-4">
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
            onClick={() => navigate(`/tournament/view?id=${tournament._id}`)}
            >
            View
          </button>

          { isAdmin ? (
            <div className="flex gap-2">
            <button
              onClick={() => navigate(`/admin/dashboard/update-tournament?id=${tournament._id}`)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              Edit
            </button>
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Delete
            </button>
          </div>
          ) : (
            new Date(tournament.startDate) > new Date() ? 
            (
            <Modal>
              <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn border border-">
          <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
            Book your flight
          </span>
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
            ✈️
          </div>
        </ModalTrigger>
              <TournamentRegister />
            </Modal>
              ) : (<></>)
          ) }
        </div>
      </div>
    </MagicCard>
  ))}
</div>


  );
}
