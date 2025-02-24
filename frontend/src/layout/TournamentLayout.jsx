import { cn } from "@/lib/utils";
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import TournamentNavBar from "../components/TournamentNavBar";
import { useEffect } from "react";
import { socket } from '../socket';

const TournamentLayout = ({ isAdmin }) => {
  if (!isAdmin) isAdmin = false;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tournamentId = searchParams.get("id") || searchParams.get("tournamentId");

  useEffect(() => {
    if (!tournamentId) {
      toast({ title: "Tournament not specified!" });
      navigate('/tournaments');
      return;
    }

    socket.connect();
    socket.emit("joinRoom", tournamentId);

    return () => {
      socket.emit("leaveRoom", tournamentId);
      socket.disconnect();
    };
  }, [tournamentId, navigate]);

  return (
    <div
      style={{ paddingTop: "80px" }}
      className={cn(
        "flex flex-col md:flex-col gap-4 rounded-md p-10 bg-gradient-to-br from-black via-gray-900 to-purple-900 w-full flex-1 mx-auto min-h-screen"
      )}
    >
      {/* Center the navbar */}
      <div className="flex justify-center h-full w-full md:w-64">
        <TournamentNavBar isAdmin={isAdmin} />
      </div>
      <main className="flex-grow mt-4 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default TournamentLayout;
