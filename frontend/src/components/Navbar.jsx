import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { logout } from '../features/userSlice';
import { useState } from 'react';

function Navbar() {
    const loggedIn = useSelector((state) => state.user.isAuthenticated);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { toast } = useToast();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        {
            name: 'Home',
            slug: '/',
            active: true,
        },
        {
            name: 'About',
            slug: '#',
            active: true,
        },
        {
            name: 'Tournaments',
            slug: '/tournaments',
            active: true,
        },
    ];

    const logoutHandler = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/user/logout');

            toast({
                title: res.data.message,
            });

            if (res.data.success) {
                dispatch(logout());
                navigate('/')
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <nav className="z-[500] bg-white border-gray-200 dark:bg-black w-full">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Lockout</span>
                </Link>

                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <button
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        type="button"
                        onClick={() => (loggedIn ? logoutHandler() : navigate('/login'))}
                        aria-label={loggedIn ? 'Logout Button' : 'Get Started Button'}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : loggedIn ? 'Logout' : 'Get Started'}
                    </button>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-cta"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>

                <div
                    className={`items-center justify-between w-full md:flex md:w-auto md:order-1 dark:bg-black ${
                        isMenuOpen ? 'block' : 'hidden'
                    }`}
                    id="navbar-cta"
                >
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-black md:dark:bg-black dark:border-gray-700">
                        {navItems.map((item) =>
                            item.active ? (
                                <li key={item.name}>
                                    <Link
                                        to={item.slug}
                                        className={`block py-2 px-3 md:p-0 md:px-5 rounded ${
                                            location.pathname === item.slug
                                                ? 'text-white bg-blue-700'
                                                : 'text-gray-400 hover:text-blue-700'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ) : null
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
