import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FaLock } from "react-icons/fa"; // Using a lock icon

const ProtectedRoutes = ({ allowed }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!allowed) {
    return (
      <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white text-center p-10">
        <div className="flex items-center justify-center mb-8">
          <FaLock className="text-6xl mr-4" />
          <h1 className="text-5xl font-semibold">Access Denied</h1>
        </div>

        <p className="text-xl mb-8">
          You don’t have permission to access this page. Please contact the administrator if you believe this is an error.
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

  return <Outlet />;
};

export default ProtectedRoutes;
