import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserAlt } from 'react-icons/fa';

const Navbar = () => {
    return (
        <header className="bg-black text-white flex items-center justify-between p-4 z-50 absolute w-full">
            <Link to='/' className="text-2xl sm:text-3xl font-bold">Lockout</Link>
            <nav className="hidden md:flex text-lg">
                <ul className="flex space-x-4">
                    <li className="hover:underline">Tournaments</li>
                    <li className="hover:underline">Hall of Fame</li>
                    <li className="hover:underline">Hi</li>
                </ul>
            </nav>
            <ul className="flex text-xl sm:text-2xl space-x-4">
                <li>
                    <Link to="/login" className="flex items-center space-x-1 hover:underline">
                        <FaSignInAlt />
                        <span>Login</span>
                    </Link>
                </li>
                <li>
                    <Link to="/register" className="flex items-center space-x-1 hover:underline">
                        <FaUserAlt />
                        <span>Register</span>
                    </Link>
                </li>
            </ul>
        </header>
    );
};

export default Navbar;
