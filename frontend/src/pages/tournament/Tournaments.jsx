import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { RegistrButton } from "@/components";
import {Loader} from "@/components";

export default function Tournament({ isAdmin = false }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };
    getTournaments();
  }, [toast]);

  if(isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    )
  }

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-10">
      {tournaments.map((tournament, idx) => (
        <div key={idx} className="bg-gradient-to-br from-gray-900 to-purple-800 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-white text-2xl font-bold mb-4">{tournament.title}</h2>
            <p className="text-gray-300 mb-4">{tournament.summary}</p>
            <div className="w-full flex items-center justify-between gap-4 mt-4">
              <button
                className="px-6 py-3 rounded-md bg-black text-white border-2 border-transparent hover:bg-opacity-80 transition-colors"
                onClick={() =>
                  navigate(
                    isAdmin
                      ? `/admin/dashboard/tournament/view?id=${tournament._id}`
                      : `/tournament/view?id=${tournament._id}`
                  )
                }
              >
                View
              </button>
              {isAdmin ? (
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate(`/admin/dashboard/update-tournament?id=${tournament._id}`)}
                    className="px-6 py-3 rounded-md bg-purple-700 text-white border-2 border-transparent hover:bg-purple-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tournament._id)}
                    className={`px-6 py-3 rounded-md text-white border-2 border-transparent ${
                      deletingId === tournament._id
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 transition-colors'
                    }`}
                    disabled={deletingId === tournament._id}
                  >
                    {deletingId === tournament._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ) : (
                new Date(tournament.startDate) > new Date() ? (
                  <RegistrButton tournamentId={tournament._id} />
                ) : (
                  <></>
                )
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
