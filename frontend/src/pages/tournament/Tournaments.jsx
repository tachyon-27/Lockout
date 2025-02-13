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
} from "@/components/ui/accordion";

export default function Tournament({ isAdmin = false }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

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

  const handleDelete = async (tournamentId) => {
    if (!window.confirm("Are you sure you want to delete this tournament?")) return;

    setDeletingId(tournamentId);
    try {
      await axios.post("/api/tournament/delete-tournament", { _id: tournamentId });
      setTournaments(tournaments.filter(t => t._id !== tournamentId));
      toast({ title: "Tournament deleted successfully!" });
    } catch (error) {
      toast({ title: "Error deleting tournament!", description: error.message });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full px-10">
      {tournaments.map((tournament, idx) => (
        <AccordionItem key={idx} value={idx}>
          <AccordionTrigger> {tournament.title} </AccordionTrigger>
          <AccordionContent>
            <div>
              <p> {tournament.summary} </p>
              <div className="w-full flex items-center mt-2 gap-2">
                <button
                  className="px-4 py-2 rounded-md bg-black text-white flex justify-center border border-solid border-white hover:bg-neutral-900"
                  onClick={() => navigate(isAdmin ? `/admin/dashboard/tournament/view?id=${tournament._id}` : `/tournament/view?id=${tournament._id}`)}
                >
                  View
                </button>
                {isAdmin ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/dashboard/update-tournament?id=${tournament._id}`)}
                      className="px-4 py-2 rounded-md bg-black text-white flex justify-center border border-solid border-white hover:bg-neutral-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tournament._id)}
                      className={`px-4 py-2 rounded-md text-white flex justify-center border border-solid border-white ${deletingId === tournament._id ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                      disabled={deletingId === tournament._id}
                    >
                      {deletingId === tournament._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                ) : (
                  new Date(tournament.startDate) > new Date() ? (
                    <RegistrButton tournamentId={tournament._id} />
                  ) : (<></>)
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
