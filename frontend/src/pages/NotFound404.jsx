import { useNavigate } from "react-router-dom";
import { FaRegSadCry } from "react-icons/fa"; // You can use any icon or illustration

export default function NotFound404() {
  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white text-center p-10">
      <div className="flex items-center justify-center mb-8">
        <FaRegSadCry className="text-6xl mr-4" />
        <h1 className="text-5xl font-semibold">Oops! Page not found</h1>
      </div>

      <p className="text-xl mb-8">
        Sorry, we couldn’t find the page you’re looking for. It might have been removed, renamed, or never existed.
      </p>

      <button
        onClick={() => navigate('/')}
        className="px-8 py-3 bg-purple-600 text-white rounded-md text-xl hover:bg-purple-700 transition-colors"
      >
        Go to Home
      </button>

      <p className="mt-4 text-lg text-gray-400">
        Or go back and check something else.
      </p>
    </div>
  );
}
