import { cn } from "@/lib/utils";
import React from 'react';
import { Outlet } from 'react-router-dom';
import TournamentNavBar from "../components/TournamentNavBar";

const TournamentLayout = () => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 rounded-md p-10 bg-gray-100 dark:bg-black w-full flex-1 mx-auto overflow-hidden h-screen")}>
      {/* Center the navbar */}
      <div className="flex justify-center h-full w-full">
        <TournamentNavBar className="md:w-64 w-full" />
      </div>
      <main className="flex-grow mt-4 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default TournamentLayout;
