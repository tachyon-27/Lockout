import { Link } from 'react-router-dom';
import { BackgroundLines } from '../components/ui/background-lines';

const Login = () => {
    return (
        <>
            < BackgroundLines>
            
            <div
                className="relative flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"
                
            >
                

                {/* Form content */}
                <div className="relative z-10 flex items-center justify-center min-h-screen text-white">
                    <form className="flex flex-col gap-4 max-w-md p-6 rounded-2xl bg-gray-900 border border-gray-700 w-full sm:w-auto">
                        <p className="text-2xl font-semibold tracking-wide flex items-center relative">
                            <span className="absolute w-4 h-4 rounded-full bg-blue-400 left-0 animate-ping"></span>
                            <span className="absolute w-4 h-4 rounded-full bg-blue-500 left-0"></span>
                            <span className="pl-6">Login</span>
                        </p>
                        <p className="text-sm text-gray-400">
                            Welcome back! Login to access your account.
                        </p>

                        <label className="relative w-full">
                            <input
                                type="email"
                                className="w-full bg-gray-700 text-white py-2 px-3 rounded-lg border border-gray-600 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Email"
                                required
                            />
                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm transition-all pointer-events-none">
                                Email
                            </span>
                        </label>

                        <label className="relative w-full">
                            <input
                                type="password"
                                className="w-full bg-gray-700 text-white py-2 px-3 rounded-lg border border-gray-600 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Password"
                                required
                            />
                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm transition-all pointer-events-none">
                                Password
                            </span>
                        </label>

                        <Link to='#' className='hover:underline text-sm text-gray-400'>Forgot password?</Link>

                        <button className="py-2 px-4 mt-4 bg-blue-500 rounded-lg text-white font-medium hover:bg-blue-400 transition">
                            Login
                        </button>
                        <p className="text-center text-sm text-gray-400">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-blue-400 hover:underline">
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
            </BackgroundLines>
        </>
    );
};

export default Login;
