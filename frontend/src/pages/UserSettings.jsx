import { useState } from "react";
import axios from "axios";
import { logout } from "@/features/userSlice";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader } from "@/components";
import { ChangePassword, Cfid, ProfileSettings } from "@/components";

const UserSettings = () => {
  const [selectedOption, setSelectedOption] = useState("profile");
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
    { id: "cfid", label: "Manage Codeforces ID", component: <Cfid /> },
    { id: "logout", label: "Logout", action: logoutHandler },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-3/4 mx-auto items-center justify-center">
      <div className="flex w-full h-3/4 shadow-lg rounded-lg overflow-hidden bg-opacity-10 backdrop-blur-lg border border-gray-500">
        {/* Sidebar Navigation */}
        <div className="w-1/4 bg-opacity-50 text-white p-4">
          <ul>
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`p-2 cursor-pointer ${
                  selectedOption === item.id ? "bg-gray-600 bg-opacity-50" : ""
                } ${item.id === "logout" ? "bg-red-600 hover:bg-red-700" : ""}`}
                onClick={() => (item.action ? item.action() : setSelectedOption(item.id))}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-4 flex flex-col items-center bg-white bg-opacity-10 backdrop-blur-lg text-white">
          {navItems.find((item) => item.id === selectedOption)?.component}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
