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
      <div className="flex items-center justify-center min-h-screen">   
        <svg
          width="100"  // Increased size
          height="100" // Increased size
          viewBox="0 0 43 41"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            animation: "rotateAnimation 2s ease-in-out infinite, scaleAnimation 1.5s ease-in-out infinite, fadeAnimation 2s infinite",
            display: "block",
            margin: "auto",
          }}
          className="min-h-full flex justify-center items-center"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.76157 14.1502C15.5195 8.85393 22.3018 3.7709 32.8364 14.3584C32.9346 14.4571 33.1047 14.3578 33.0727 14.2223C27.4647 -9.51574 10.0653 0.757488 9.5335 14.0443C9.52864 14.1658 9.67211 14.2325 9.76157 14.1502ZM9.3385 16.4538C10.6027 13.8876 13.5896 11.7546 15.4474 10.6566C15.4784 10.6383 15.5132 10.6733 15.4965 10.7052C15.1813 11.3067 14.6988 12.4453 14.852 13.0433C14.8596 13.0728 14.8505 13.1039 14.8266 13.1227C13.9967 13.7763 12.8643 15.4552 14.6778 17.2144C14.6879 17.2241 14.6951 17.2364 14.6982 17.2501C14.8736 18.0329 15.2833 19.5927 15.5572 19.7295C15.8336 19.8674 11.1817 19.7869 8.82126 19.7295C8.82126 18.6951 8.84006 17.4656 9.3385 16.4538ZM32.8416 16.4538C31.5773 13.8876 28.5904 11.7546 26.7326 10.6566C26.7016 10.6383 26.6668 10.6733 26.6835 10.7052C26.9987 11.3067 27.4813 12.4453 27.328 13.0433C27.3205 13.0728 27.3296 13.1039 27.3535 13.1227C28.1833 13.7763 29.3158 15.4552 27.5022 17.2144C27.4922 17.2241 27.4849 17.2364 27.4819 17.2501C27.3065 18.0329 26.8968 19.5927 26.6228 19.7295C26.3478 19.8667 30.9543 19.7877 33.325 19.7303C33.3443 19.7298 33.3588 19.7142 33.3588 19.695C33.3583 18.6678 33.3345 17.4543 32.8416 16.4538ZM19.8008 13.4367H16.3459C16.0126 13.4367 15.7425 13.7069 15.7425 14.0401V15.4193C15.7425 15.7526 16.0126 16.0228 16.3459 16.0228H19.8008C20.1341 16.0228 20.4042 15.7526 20.4042 15.4193V14.5574H21.7876V15.4193C21.7876 15.7526 22.0578 16.0228 22.391 16.0228H25.846C26.1792 16.0228 26.4494 15.7526 26.4494 15.4193V14.0401C26.4494 13.7069 26.1792 13.4367 25.846 13.4367H22.391C22.0578 13.4367 21.7876 13.7069 21.7876 14.0401V14.1263H20.4042V14.0401C20.4042 13.7069 20.1341 13.4367 19.8008 13.4367ZM16.1735 14.0401C16.1735 13.9449 16.2506 13.8677 16.3459 13.8677H19.8008C19.896 13.8677 19.9732 13.9449 19.9732 14.0401V15.4193C19.9732 15.5146 19.896 15.5917 19.8008 15.5917H16.3459C16.2506 15.5917 16.1735 15.5146 16.1735 15.4193V14.0401ZM22.2186 14.0401C22.2186 13.9449 22.2958 13.8677 22.391 13.8677H25.846C25.9412 13.8677 26.0184 13.9449 26.0184 14.0401V15.4193C26.0184 15.5146 25.9412 15.5917 25.846 15.5917H22.391C22.2958 15.5917 22.2186 15.5146 22.2186 15.4193V14.0401ZM6.8467 22.8327C6.8467 21.7853 7.69577 20.9362 8.74314 20.9362H33.4486C34.4959 20.9362 35.345 21.7853 35.345 22.8327V38.8661C35.345 39.9135 34.4959 40.7626 33.4486 40.7626H8.74314C7.69577 40.7626 6.8467 39.9135 6.8467 38.8661V22.8327ZM23.2548 30.8493C23.2548 29.6592 22.2882 28.6943 21.0958 28.6943C19.9035 28.6943 18.9369 29.6592 18.9369 30.8493C18.9369 32.0395 19.9035 33.0044 21.0958 33.0044C22.2882 33.0044 23.2548 32.0395 23.2548 30.8493ZM36.3813 24.4526V40.477C36.3813 40.6823 36.5477 40.8487 36.753 40.8487C36.8471 40.8487 36.9377 40.813 37.0065 40.7488L41.7216 36.3509C42.0019 36.0895 42.1413 35.7105 42.0973 35.3298L41.4552 29.7748C41.4129 29.4089 41.2545 29.0662 41.0033 28.7969L36.7981 24.2884C36.7526 24.2396 36.6888 24.2118 36.622 24.2118C36.4891 24.2118 36.3813 24.3196 36.3813 24.4526ZM5.72403 40.477V24.4526C5.72403 24.3196 5.61623 24.2118 5.48326 24.2118C5.4165 24.2118 5.35274 24.2396 5.3072 24.2884L1.10201 28.7969C0.850781 29.0662 0.692418 29.4089 0.650123 29.7748L0.00799327 35.3298C-0.036015 35.7105 0.103422 36.0895 0.383681 36.3509L5.09879 40.7488C5.16761 40.813 5.25821 40.8487 5.35232 40.8487C5.55761 40.8487 5.72403 40.6823 5.72403 40.477Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
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
