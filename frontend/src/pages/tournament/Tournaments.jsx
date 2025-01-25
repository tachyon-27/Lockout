import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { RegistrButton } from "@/components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function Tournament({ isAdmin }) {
  if(!isAdmin) isAdmin = false;
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const getTournaments = async () => {
      try {
        const res = await axios.get("/api/tournament/tournaments");

        setTournaments(res.data.data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message,
        });
      }
    };
    getTournaments();
  }, [toast]);

  return (
    <Accordion type="single" collapsible className="w-[80vw]">
      {tournaments.map((tournament, idx) => (
        <AccordionItem key={idx} value={idx}>
          <AccordionTrigger> {tournament.title} </AccordionTrigger>
          <AccordionContent>
            <div>
              <p> {tournament.summary} </p>
         
              <div className="w-full flex items-center mt-2 gap-2">
                <button
                  className="px-4 py-2 rounded-md bg-black text-white flex justify-center border border-solid border-white hover:bg-neutral-900"
                  onClick={() => navigate(`/tournament/view?id=${tournament._id}`)}
                >
                  View
                </button>

                { isAdmin ? (
                  <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/dashboard/update-tournament?id=${tournament._id}`)}
                    className="px-4 py-2 rounded-md bg-black text-white flex justify-center border border-solid border-white hover:bg-neutral-900"
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 rounded-md bg-black text-white flex justify-center border border-solid border-white hover:bg-neutral-900"
                  >
                    Delete
                  </button>
                </div>
                ) : (
                  new Date(tournament.startDate) > new Date() ? (
                      <RegistrButton tournamentId={tournament._id}/>
                    ) : (<></>)
                ) }
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
