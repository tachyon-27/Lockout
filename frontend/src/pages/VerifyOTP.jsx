import { Link, useParams } from 'react-router-dom';
import { BackgroundLines } from '../components/ui/background-lines';
import { useDispatch } from 'react-redux'

function Verify() {
  const {what} = useParams()
  const dispatch = useDispatch()
  return (
    <>
        < BackgroundLines>       
        <div
            className="relative flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"           
        >
            <div className="relative z-10 flex items-center justify-center min-h-screen text-white">
                <form className="flex flex-col gap-4 max-w-md p-6 rounded-2xl bg-gray-900 border border-gray-700 w-full sm:w-auto">
                    <p className="text-2xl font-semibold tracking-wide flex items-center relative">
                        <span className="absolute w-4 h-4 rounded-full bg-blue-400 left-0 animate-ping"></span>
                        <span className="absolute w-4 h-4 rounded-full bg-blue-500 left-0"></span>
                        <span className="pl-6">Enter OTP</span>
                    </p>
                    <p className="text-sm text-gray-400">
                        Check your email, we just sent the OTP on your email.
                    </p>

                    <label className="relative w-full">
                        <input
                            type="email"
                            className="w-[100%] bg-gray-700 text-white py-2 px-3 rounded-lg border border-gray-600 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter OTP"
                            required
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400 text-sm transition-all pointer-events-none">
                            Email
                        </span>
                    </label>

                    <button className="py-2 px-4 mt-4 bg-blue-500 rounded-lg text-white font-medium hover:bg-blue-400 transition">
                        Verify
                    </button>

                    <p className="text-center text-sm text-gray-400">
                        Didn't received the OTP?{" "}
                        <Link to="/register" className="text-blue-400 hover:underline">
                            Resend OTP
                        </Link>
                    </p>
                </form>
            </div>
        </div>
        </BackgroundLines>
    </>
  );
}

export default Verify