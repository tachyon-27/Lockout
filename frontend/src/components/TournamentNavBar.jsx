import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useLocation, Link, useSearchParams } from "react-router-dom";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

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
      active: isAdmin, // Only active for admin
    },
  ];

  useEffect(() => {
    const activeIndex = routes.findIndex((route) => location.pathname === route.path);
    if (activeIndex !== -1) {
      setValue(activeIndex);
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        variant="scrollable"
        scrollButtons={false}
        value={value}
        onChange={handleChange}
        aria-label="Tournament Navbar"
        sx={{ color: "white" }}
      >
        {routes
          .filter((route) => route.active) // Ensure only active routes are displayed
          .map((route, index) => (
            <Tab
              key={index}
              label={route.label}
              component={Link}
              to={route.path}
              sx={{
                color: "white",
                "&:hover": {
                  color: "white",
                  background: "#1976D2",
                  borderRadius: "10px 10px 0px 0px",
                },
              }}
              {...a11yProps(index)}
            />
          ))}
      </Tabs>
    </Box>
  );
}
