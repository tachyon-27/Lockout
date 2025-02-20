import { TournamentRegister, AddCfID, VerifyCfID } from "@/components";
import { ModalBody, Modal, ModalTrigger } from '@/components/ui/animated-modal';
import { useState } from "react";
import { FaLaptopCode, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RegistrButton = ({ tournamentId, isRegistered, onUnregister }) => {
    const [addID, setAddID] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [handle, setHandle] = useState("");
    const [verifyString, setVerifyString] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    
    const isLoggedIn = useSelector(state => state.user.isAuthenticated);
    const navigate = useNavigate();

    const handleClick = () => {
        if (isLoggedIn) {
            if (isRegistered) {
                setShowConfirm(true); 
            } else {
                setAddID(false);
                setIsAuth(false);
            }
        } else {
            navigate('/login');
        }
    };

    const handleUnregister = () => {
        setShowConfirm(false);
        if (onUnregister) {
            onUnregister(tournamentId);
        }
    };

    return (
        <div className="relative">
            {!isRegistered ? (
                <Modal>
                    <div className="p-0" onClick={handleClick}>
                        <ModalTrigger className="bg-black text-white flex justify-center group/modal-btn border border-solid border-gray-600 relative px-4 py-2 rounded-md transition duration-300 hover:bg-gray-800">
                            <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
                                Register
                            </span>
                            <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
                                <FaLaptopCode className="text-white" /> 
                            </div>
                        </ModalTrigger>
                    </div>
                    <ModalBody>
                        {addID ? (
                            <AddCfID setAddID={setAddID} setIsAuth={setIsAuth} setHandle={setHandle} setVerifyString={setVerifyString} />
                        ) : isAuth ? (
                            <VerifyCfID handle={handle} verifyString={verifyString} setIsAuth={setIsAuth} />
                        ) : (
                            <TournamentRegister setAddID={setAddID} tournamentId={tournamentId} />
                        )}
                    </ModalBody>
                </Modal>
            ) : (
                <button 
                    className="bg-red-700 text-white flex items-center justify-center border border-red-500 px-4 py-2 rounded-md transition duration-300 hover:bg-red-800"
                    onClick={handleClick}
                >
                    <span className="mr-2">Unregister</span>
                    <FaSignOutAlt />
                </button>
            )}

            {showConfirm && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900 shadow-lg border border-gray-700 rounded-lg p-4 w-56 z-50">
                    <p className="text-sm text-gray-200 text-center">Are you sure you want to unregister?</p>
                    <div className="mt-3 flex justify-center gap-3">
                        <button 
                            className="bg-red-600 text-white px-3 py-1 rounded-md text-sm transition duration-200 hover:bg-red-700"
                            onClick={handleUnregister}
                        >
                            Yes, Unregister
                        </button>
                        <button 
                            className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm transition duration-200 hover:bg-gray-600"
                            onClick={() => setShowConfirm(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistrButton;
