import { useState } from "react";
import { ChangePassword } from "@/components";

const Cfid = () => <div>CFID Component</div>;

const UserSettings = () => {
  const [selectedOption, setSelectedOption] = useState("changePassword");

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
              CFID
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
