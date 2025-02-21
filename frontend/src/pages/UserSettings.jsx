import { useState } from "react";
import { ChangePassword } from "@/components";
import Cfid from "@/components/Cfid";
import axios from 'axios';
import { logout } from '@/features/userSlice';
import { useDispatch } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {Loader} from '@/components';

const UserSettings = () => {
  const [selectedOption, setSelectedOption] = useState("changePassword");
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    setLoading(true);
    try {
        const res = await axios.get('/api/user/logout');

        toast({ title: res.data.message });

        if (res.data.success) {
            dispatch(logout());
            navigate('/');
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

  if(loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-3/4 mx-auto items-center justify-center">
      <div className="flex w-full h-3/4 shadow-lg rounded-lg overflow-hidden bg-opacity-10 backdrop-blur-lg border border-gray-500">
        <div className="w-1/4 bg-opacity-50 text-white p-4">
          <ul>
            <li
              className={`p-2 cursor-pointer ${selectedOption === "changePassword" ? "bg-gray-600 bg-opacity-50" : ""}`}
              onClick={() => setSelectedOption("changePassword")}
            >
              Change Password
            </li>
            <li
              className={`p-2 cursor-pointer ${selectedOption === "cfid" ? "bg-gray-600 bg-opacity-50" : ""}`}
              onClick={() => setSelectedOption("cfid")}
            >
              Manage Codeforces ID
            </li>
            <li
              className={`p-2 cursor-pointer ${selectedOption === "cfid" ? "bg-gray-600 bg-opacity-50" : ""}`}
              onClick={logoutHandler}
            >
              Logout
            </li>
          </ul>
        </div>
        <div className="w-3/4 p-4 flex flex-col items-center bg-white bg-opacity-10 backdrop-blur-lg text-white">
          {selectedOption === "changePassword" && <ChangePassword />}
          {selectedOption === "cfid" && <Cfid />}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
