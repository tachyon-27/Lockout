import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
      <h1 className="text-5xl font-bold mb-4">Welcome, Admin!</h1>
      <p className="text-lg text-gray-300 max-w-lg">
        Manage tournaments, matches, and monitor progress with ease.
      </p>
      <button
        onClick={() => navigate("/admin/dashboard/tournaments")}
        className="mt-6 px-6 py-3 text-lg font-semibold bg-purple-600 hover:bg-purple-700 transition-all rounded-xl shadow-lg"
      >
        Get Started
      </button>
    </div>
  );
};

export default AdminDashboard;
