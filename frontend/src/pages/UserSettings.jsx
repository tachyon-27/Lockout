import { useState } from "react";
import axios from "axios";
import { logout } from "@/features/userSlice";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader } from "@/components";
import { ChangePassword, Cfid, ProfileSettings } from "@/components";
import { FaBars, FaTimes } from "react-icons/fa";

const UserSettings = () => {
  const [selectedOption, setSelectedOption] = useState("profile");
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/user/logout");
      toast({ title: res.data.message });

      if (res.data.success) {
        dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: "profile", label: "Profile", component: <ProfileSettings /> },
    { id: "changePassword", label: "Change Password", component: <ChangePassword /> },
    { id: "cfid", label: "Manage Codeforces IDs", component: <Cfid /> },
    { id: "logout", label: "Logout", action: logoutHandler },
  ];

  if (loading) {
    return (
        <Loader />
    );
  }

  return (
    <div className="flex h-screen w-full mx-auto items-center justify-center">
      <div className="flex w-full max-w-4xl h-3/4 shadow-lg rounded-lg overflow-hidden bg-opacity-10 backdrop-blur-lg border border-gray-500 relative">
        
        <button
          className="absolute top-4 left-4 md:hidden text-white text-2xl z-50"
          onClick={() => setMenuOpen(true)}
        >
          <FaBars />
        </button>

        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 left-0 h-full w-64 bg-gray-950 md:bg-transparent text-white p-4 z-50 transform transition-transform duration-300
            ${menuOpen ? "translate-x-0" : "-translate-x-full"} 
            md:relative md:translate-x-0 md:w-1/4`}
        >
          <button className="absolute top-4 right-4 text-white text-2xl md:hidden" onClick={() => setMenuOpen(false)}>
            <FaTimes />
          </button>

          <ul className="w-full mt-8 md:mt-0">
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`p-3 my-1 cursor-pointer text-center rounded-md transition ${
                  selectedOption === item.id ? "bg-gray-600 bg-opacity-50" : ""
                } ${item.id === "logout" ? "bg-red-600 hover:bg-red-700" : "hover:bg-gray-700"}`}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setSelectedOption(item.id);
                  }
                  setMenuOpen(false); // Close menu after selection
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 md:p-4 flex flex-col items-center bg-white bg-opacity-10 backdrop-blur-lg text-white">
          {navItems.find((item) => item.id === selectedOption)?.component}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
