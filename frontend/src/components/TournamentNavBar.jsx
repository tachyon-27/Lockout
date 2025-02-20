import { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

export default function TournamentNavBar({ isAdmin }) {
  const [value, setValue] = useState(0);
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get("id") || searchParams.get("tournamentId");
  const location = useLocation();

  const routes = [
    {
      path: isAdmin
        ? `/admin/dashboard/tournament/view?id=${tournamentId}`
        : `/tournament/view?id=${tournamentId}`,
      label: "View",
      active: true,
    },
    {
      path: isAdmin
        ? `/admin/dashboard/tournament/fixtures?id=${tournamentId}`
        : `/tournament/fixtures?id=${tournamentId}`,
      label: "Fixtures",
      active: true,
    },
    {
      path: isAdmin
        ? `/admin/dashboard/tournament/all-matches?id=${tournamentId}`
        : `/tournament/all-matches?id=${tournamentId}`,
      label: "Matches",
      active: true,
    },
    {
      path: isAdmin
        ? `/admin/dashboard/tournament/participants?id=${tournamentId}`
        : `/tournament/participants?id=${tournamentId}`,
      label: "Participants",
      active: true,
    },
    {
      path: `/admin/dashboard/tournament/settings?id=${tournamentId}`,
      label: "Settings",
      active: isAdmin, 
    },
  ];

  useEffect(() => {
    const activeIndex = routes.findIndex((route) => location.pathname === route.path);
    if (activeIndex !== -1) {
      setValue(activeIndex);
    }
  }, [location.pathname]);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <div
      className="pt-2 left-0 w-full shadow-lg"
      style={{
        overflowX: "auto",
        overflowY: "hidden",
        whiteSpace: "nowrap",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE
      }}
    >
      <div 
        className="flex space-x-4"
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          display: "flex",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE
        }}
      >
        {routes
          .filter((route) => route.active) // Only show active routes
          .map((route, index) => (
            <Link
              key={index}
              to={route.path}
              className={`px-5 rounded-lg text-white text-md font-medium transition-colors duration-300
                ${value === index ? "bg-purple-700 shadow-lg" : "hover:bg-purple-600"} 
                ${value === index ? "border-b-4 border-purple-500" : ""}
                `}
              onClick={() => handleChange(index)}
            >
              {route.label}
            </Link>
          ))}
      </div>
    </div>
  );
}
