import { Outlet } from "react-router-dom";
import Logo from '@/assets/Logo.svg';

function RegisterLayout() {
  return (
    <div className="w-screen max-h-screen flex items-center justify-center
    bg-gradient-to-br from-black via-gray-900 to-purple-900">

      <div className="w-full h-full flex flex-col md:flex-row items-center justify-center px-6 md:px-16 lg:px-24">

        <div className="flex-col justify-center items-center text-center w-full md:w-1/2 mb-10 md:mb-0 hidden md:flex">
          <img 
            src={Logo} 
            alt="BitLegion" 
            className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]" 
          />
          <p className="font-chunkfive text-5xl text-white drop-shadow-md mt-6">
            Enter The Lockout Arena
          </p>
        </div>

        <div className="w-full md:w-1/2 flex justify-center pt-20">
            <Outlet />
        </div>

      </div>

    </div>
  );
}

export default RegisterLayout;
