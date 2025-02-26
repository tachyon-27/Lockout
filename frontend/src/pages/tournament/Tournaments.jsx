import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { RegistrButton } from "@/components";
import { Loader } from "@/components";

export default function Tournament({ isAdmin = false }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen min-w-screen">
        <Loader />
      </div>
    );
  }

  if (tournaments.length === 0) {
    return <p className="text-center text-white text-xl">No tournaments available.</p>;
  }

  const now = new Date();

  const upcomingTournaments = tournaments
    .filter(tournament => new Date(tournament.startDate) > now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  let upcomingTournament = upcomingTournaments.length > 0 ? upcomingTournaments[0] : null;
  let isOngoing = false;

  const pastTournaments = tournaments
  .filter(tournament => new Date(tournament.startDate) <= now)
  .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  if(pastTournaments.length > 0 && !pastTournaments[0].endDate) {
    isOngoing = true;
    upcomingTournament = pastTournaments[0]
    pastTournaments.shift()
  }


  const handleDelete = async (tournamentId) => {
    if (!window.confirm("Are you sure you want to delete this tournament?")) return;

    setDeletingId(tournamentId);
    try {
      await axios.post("/api/tournament/delete-tournament", { _id: tournamentId });
      setTournaments(tournaments.filter((t) => t._id !== tournamentId));
      toast({ title: "Tournament deleted successfully!" });
    } catch (error) {
      toast({ title: "Error deleting tournament!", description: error.message });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-2 md:p-10 mt-20 md:mt-14 bg-gradient-to-br from-black via-gray-950/80 to-purple-950/90 min-h-screen">

      {upcomingTournament && <div className="w-[90%] md:w-4/5 mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-xl shadow-lg p-8 text-white mb-10 min-h-[85vh] flex flex-col justify-center items-center border border-gray-600 hover:shadow-2xl transition-all duration-300 ease-in-out">
        {upcomingTournament.coverImage && (
          <img src={upcomingTournament.coverImage} alt={upcomingTournament.title} className="w-full h-auto max-h-80 object-contain rounded-xl mb-4" />
        )}
        <h2 className="text-3xl font-bold mb-4">{isOngoing ? "Ongoing" : "Upcoming"} Tournament</h2>
        <h3 className="text-2xl font-semibold">{upcomingTournament.title}</h3>
        <p className="text-gray-300 mb-4">{upcomingTournament.summary}</p>
        <div className="flex items-center justify-between mt-4 gap-4">
          <button
            className="px-6 py-3 rounded-md bg-black text-white hover:bg-opacity-80 transition-colors"
            onClick={() => navigate(`${ isAdmin ? `/admin/dashboard` : "" }/tournament/view?id=${upcomingTournament._id}`)}
          >
            View
          </button>
          
          {isAdmin && (
            <>
              <button
                onClick={() => navigate(`/admin/dashboard/update-tournament?id=${upcomingTournament._id}`)}
                className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(upcomingTournament._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>}
    
      <div className="w-[90%] md:w-4/5 mx-auto text-5xl font-extrabold text-center p-6">
        Upcoming Tournaments
      </div>

      {upcomingTournaments.length !== 0 ?
      <div className="w-[90%] md:w-4/5 mx-auto bg-gray-900 rounded-lg p-6 shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-3 bg-gray-800 text-white font-bold py-3 px-4 rounded-t-md text-center">
          <div className="col-span-1">Title</div>
          <div className="hidden md:block col-span-1">Summary</div>
          <div className="col-span-1">Actions</div>
        </div>
         
        {upcomingTournaments.map((tournament) => (
          <div key={tournament._id} className="grid grid-cols-2 md:grid-cols-3 items-center text-white border-b border-gray-700 py-3 px-4 hover:bg-gray-800 transition duration-300 text-center">
            <div className="col-span-1 overflow-hidden text-ellipsis ">{tournament.title}</div>
            <div className="hidden md:block col-span-1">{tournament.summary}</div>
            <div className="col-span-1 relative">
              {isAdmin ? (
                <>
                  <div className="hidden lg:flex gap-2 justify-center">
                    <button onClick={() => navigate(`${ isAdmin ? `/admin/dashboard` : "" }/tournament/view?id=${tournament._id}`)} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">View</button>
                    <button onClick={() => navigate(`/admin/dashboard/update-tournament?id=${tournament._id}`)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">Edit</button>
                    <button onClick={() => handleDelete(tournament._id)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                  </div>

                  <div className="block lg:hidden">
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === tournament._id ? null : tournament._id)}
                      className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                    >
                      Actions
                    </button>
                    {dropdownOpen === tournament._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg text-left z-10">
                        <button onClick={() => navigate(`/tournament/view?id=${tournament._id}`)} className="w-full text-left px-4 py-2 hover:bg-gray-700">View</button>
                        <button onClick={() => navigate(`/admin/dashboard/update-tournament?id=${tournament._id}`)} className="w-full text-left px-4 py-2 hover:bg-gray-700">Edit</button>
                        <button onClick={() => handleDelete(tournament._id)} className="w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700">Delete</button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button onClick={() => navigate(`${ isAdmin ? `/admin/dashboard` : "" }/tournament/view?id=${tournament._id}`)} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">View</button>
              )}
            </div>
          </div>
        ))}
        
      </div>
      : (<div className="text-center text-2xl font-bold text-gray-300 py-10">
      <p className="bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500 text-transparent bg-clip-text animate-pulse">
        No tournaments yet! Stay tuned for upcoming events.
      </p>
    </div>)
  
    }
      <div className="w-[90%] md:w-4/5 mx-auto text-5xl font-extrabold text-center p-6">
        Past Tournaments
      </div>

      {pastTournaments.length !== 0 ?
      <div className="w-[90%] md:w-4/5 mx-auto bg-gray-900 rounded-lg p-6 shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-3 bg-gray-800 text-white font-bold py-3 px-4 rounded-t-md text-center">
          <div className="col-span-1">Title</div>
          <div className="hidden md:block col-span-1">Summary</div>
          <div className="col-span-1">Actions</div>
        </div>
         
        {pastTournaments.map((tournament) => (
          <div key={tournament._id} className="grid grid-cols-2 md:grid-cols-3 items-center text-white border-b border-gray-700 py-3 px-4 hover:bg-gray-800 transition duration-300 text-center">
            <div className="col-span-1 overflow-hidden text-ellipsis ">{tournament.title}</div>
            <div className="hidden md:block col-span-1">{tournament.summary}</div>
            <div className="col-span-1 relative">
              {isAdmin ? (
                <>
                  <div className="hidden lg:flex gap-2 justify-center">
                    <button onClick={() => navigate(`${ isAdmin ? `/admin/dashboard` : "" }/tournament/view?id=${tournament._id}`)} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">View</button>
                    <button onClick={() => navigate(`/admin/dashboard/update-tournament?id=${tournament._id}`)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">Edit</button>
                    <button onClick={() => handleDelete(tournament._id)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                  </div>

                  <div className="block lg:hidden">
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === tournament._id ? null : tournament._id)}
                      className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                    >
                      Actions
                    </button>
                    {dropdownOpen === tournament._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg text-left z-10">
                        <button onClick={() => navigate(`/tournament/view?id=${tournament._id}`)} className="w-full text-left px-4 py-2 hover:bg-gray-700">View</button>
                        <button onClick={() => navigate(`/admin/dashboard/update-tournament?id=${tournament._id}`)} className="w-full text-left px-4 py-2 hover:bg-gray-700">Edit</button>
                        <button onClick={() => handleDelete(tournament._id)} className="w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700">Delete</button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button onClick={() => navigate(`${ isAdmin ? `/admin/dashboard` : "" }/tournament/view?id=${tournament._id}`)} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">View</button>
              )}
            </div>
          </div>
        ))}
        
      </div>
      : (<div className="text-center text-2xl font-bold text-gray-300 py-10">
      <p className="bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500 text-transparent bg-clip-text animate-pulse">
        No tournaments yet! Stay tuned for upcoming events.
      </p>
    </div>)
  
    }
    </div>
    
  );
}
