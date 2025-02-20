import { cn } from "@/lib/utils";
import { Outlet } from 'react-router-dom';
import TournamentNavBar from "../components/TournamentNavBar";

const TournamentLayout = ({ isAdmin }) => {
  if (!isAdmin) isAdmin = false;

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
