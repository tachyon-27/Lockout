import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useLocation, Link } from 'react-router-dom';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function TournamentNavBar() {
    const [value, setValue] = useState(0);
    const location = useLocation();

    const routes = [
        { path: '/tournament/view', label: 'View Tournament', component: 'View Tournament' },
        { path: '/tournament/anotherRoute', label: 'Another Route', component: 'Another Route' },
        { path: '/tournament/yetAnotherRoute', label: 'Yet Another Route', component: 'Yet Another Route' },
    ];

    useEffect(() => {
        const activeIndex = routes.findIndex(route => location.pathname === route.path);
        if (activeIndex !== -1) {
            setValue(activeIndex);
        }
    }, [location.pathname]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    variant="scrollable"
                    scrollButtons={false}
                    value={value}
                    onChange={handleChange}
                    aria-label="Tournament Navbar"
                    sx={{ color: "white" }}
                >
                    {routes.map((route, index) => (
                        <Tab
                            key={index}
                            label={route.label}
                            component={Link}
                            to={route.path}
                            sx={{
                                color: "white",
                                '&:hover': {
                                    color: "#1976D2",
                                }
                            }}
                            {...a11yProps(index)}
                        />
                    ))}
                </Tabs>
            </Box>

    );
}
