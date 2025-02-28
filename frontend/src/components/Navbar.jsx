import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { FaRegUser } from 'react-icons/fa';
import Logo from '@/assets/Logo.svg';

function Navbar() {
    const loggedIn = useSelector((state) => state.user.isAuthenticated);
    const navigate = useNavigate();
    const location = useLocation(); 
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: 'Home', slug: '#home', active: true },
        { name: 'About', slug: '#about', active: true },
        { name: 'History', slug: '#history', active: true },
        { name: 'Tournaments', slug: '/tournaments', active: true } // Real route
    ];

    const handleScroll = (id) => {
        const section = document.querySelector(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setIsMenuOpen(false); 
    };

    const handleNavigation = (item) => {
        if (item.slug.startsWith("#")) {
            if (location.pathname !== "/") {
                navigate(`/${item.slug}`);
            } else {
                handleScroll(item.slug);
            }
        } else {
            navigate(item.slug); 
        }
    };

    useEffect(() => {
        if (location.hash) {
            handleScroll(location.hash);
        }
    }, [location]);

    return (
        <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[85%] lg:w-[70%] 
                backdrop-blur-[500px] border border-white/20 shadow-lg 
                rounded-[26px] py-[9px] px-4 flex items-center justify-between z-50 
                bg-gradient-to-r from-white/40 via-white/60 to-white/10 
                dark:from-gray-800/40 dark:via-gray-800/20 dark:to-gray-900/10">

            <Link to="/" className="text-xl font-bold">
                <img 
                    src={Logo} 
                    alt="BitLegion" 
                    className="w-7 h-7" 
                />
            </Link>

            <button
                className="md:hidden mx-auto text-lg px-3 py-1 
                rounded-lg hover:bg-white/20 hover:backdrop-blur-sm 
                transition-all"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle Menu"
            >
                ☰ Menu
            </button>

            <ul className={`md:flex gap-4 ${isMenuOpen ? "block" : "hidden"} 
                    absolute md:static top-full left-0 w-full md:w-auto 
                    bg-black/60 md:bg-transparent shadow-md md:shadow-none 
                    rounded-3xl p-2 md:p-0`}>

                {navItems.map((item) => (
                    <li key={item.slug}
                        className="hover:bg-white/20 hover:backdrop-blur-sm 
                        rounded-lg px-3 transition-all mt-1 md:mt-0">
                        {item.slug.startsWith("#") ? (
                            <button onClick={() => {
                                handleNavigation(item)
                                setIsMenuOpen(false);    
                            }} className="w-full text-left">
                                {item.name}
                            </button>
                        ) : (
                            <Link onClick={() => setIsMenuOpen(false)} to={item.slug}>{item.name}</Link>
                        )}
                    </li>
                ))}
            </ul>

            <button
                className={`block bg-white/20 backdrop-blur-md border border-white/30 
                font-medium text-sm ${loggedIn ? "rounded-full p-2" : "rounded-lg px-3 py-1"}
                hover:bg-white/30 transition dark:bg-gray-800/40 
                dark:border-gray-600/50 dark:hover:bg-gray-800/60`}
                type="button"
                onClick={() => (loggedIn ? navigate('/user-settings') : navigate("/login"))}
                aria-label={loggedIn ? "Logout Button" : "Get Started Button"}
            >
                { loggedIn ? <FaRegUser  /> : "Get Started"}
            </button>

        </nav>
    );
};

export default Navbar;
