import { TournamentRegister, AddCfID, VerifyCfID } from "@/components";
import { ModalBody, Modal, ModalTrigger } from '@/components/ui/animated-modal';
import { useState } from "react";
import { FaLaptopCode, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useToast } from "@/hooks/use-toast"

const RegistrButton = ({ tournamentId, isRegistered: initialIsRegistered }) => {
    const [addID, setAddID] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [handle, setHandle] = useState("");
    const [verifyString, setVerifyString] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [isRegistered, setIsRegistered] = useState(initialIsRegistered);  
    const [loading, setLoading] = useState(false);  // 🔥 Loading state for unregistering
    const { toast } = useToast();
    
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

    const handleUnregister = async () => {
        setShowConfirm(false);
        setLoading(true); // 🔥 Show loading while unregistering
        try {
            const res = await axios.post('/api/tournament/tournament-unregister', { _id: tournamentId });

            toast({ title: res.data.message });

            if (res.data.success) {
                setIsRegistered(false);  // 🔥 Update state after successful unregister
            }
        } catch (error) {
            toast({ title: error.message });
        } finally {
            setLoading(false); // 🔥 Stop loading after request completes
        }
    };

    const handleRegister = () => {
        setIsRegistered(true);
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
                            <TournamentRegister setAddID={setAddID} tournamentId={tournamentId} onRegister={handleRegister} />
                        )}
                    </ModalBody>
                </Modal>
            ) : (
                <button 
                    className={`flex items-center justify-center border border-red-500 px-4 py-2 rounded-md transition duration-300 
                        ${loading ? "bg-red-500 cursor-not-allowed opacity-50" : "bg-red-700 hover:bg-red-800"} text-white`}
                    onClick={handleClick}
                    disabled={loading}  // 🔥 Prevent multiple clicks
                >
                    <span className="mr-2">{loading ? "Unregistering..." : "Unregister"}</span>
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
                            disabled={loading}  // 🔥 Prevent multiple clicks
                        >
                            {loading ? "Processing..." : "Yes, Unregister"}
                        </button>
                        <button 
                            className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm transition duration-200 hover:bg-gray-600"
                            onClick={() => setShowConfirm(false)}
                            disabled={loading}  // 🔥 Disable if loading
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
