import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { FaTimes, FaClipboard, FaCheck } from "react-icons/fa";

const Cfid = () => {
    const [cfids, setCfids] = useState([]);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [handle, setHandle] = useState("");
    const [verifyString, setVerifyString] = useState("");
    const [cfid, setCfid] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const [confirmPopup, setConfirmPopup] = useState(null);
    const [removeDisabled, setRemoveDisabled] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchCfids = async () => {
            try {
                const response = await axios.get("/api/user/get-cfids");
                if (response.data.success) {
                    setCfids(response.data.data.cfids);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchCfids();
    }, []);

    const removeCfid = async (index) => {
        setConfirmPopup(null);
        setRemoveDisabled(true);
        try {
            const res = await axios.post("/api/user/remove-cfid", { cfid: cfids[index].cfid });

            toast({ title: res.data.message });

            if (!res.data.success) {
                return;
            }
            const updatedCfids = cfids.filter((_, i) => i !== index);
            setCfids(updatedCfids);
        } catch (err) {
            toast({ title: err.message });
        } finally {
            setRemoveDisabled(false);
        }
    };

    const onSubmit = async () => {
        setError("");
        setIsSubmitting(true);
        try {
            const response = await axios.get(`https://codeforces.com/api/user.info?handles=${cfid}`);
            
            if (!response.data || response.data.status !== "OK" || response.data.result.length === 0) {
                setError("Codeforces ID not found");
                return;
            }

            const res = await axios.post("/api/cf/add-id", { cfid });
            if(res.data.success) {
                setHandle(cfid);
                setVerifyString(res.data.data.verifyString);
                setShowAddPopup(false);
                setIsAuth(true);
            } else {
                setError(res.data.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || "This Codeforces Handle does not exist.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const verifyCFID = async () => {
        setIsSubmitting(true);
        setError("");
        try {
            const res = await axios.post("/api/cf/verify-id", { cfid: handle });
            if (!res.data.success) {
                setError(res.data.message);
                return;
            }
            setCfids((prevCfids) => [...prevCfids, res.data.data]);
            setIsAuth(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message || err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyText = () => {
        navigator.clipboard
            .writeText(verifyString)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 1000);
            })
            .catch((error) => setError(error.message));
    };

    return (
        <div className="p-6 w-full max-w-lg mx-auto text-white">
            <h2 className="text-2xl font-semibold mb-4">Codeforces IDs</h2>
            <div className="p-4">
                <ul className="space-y-2">
                    {cfids.length > 0 ? (
                        cfids.map((cfid, index) => (
                            <li key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition">
                                <span className="text-lg font-medium">{cfid.cfid}</span>
                                <button
                                    disabled={removeDisabled}
                                    onClick={() => setConfirmPopup(index)}
                                    className="text-red-500 hover:text-red-700 transition"
                                >
                                    <FaTimes size={18} />
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-400">No Codeforces IDs available</li>
                    )}
                </ul>
                <button
                    onClick={() => {
                        setError("");
                        setShowAddPopup(true)
                    }}
                    className="mt-4 w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition"
                >
                    Add Codeforces ID
                </button>
            </div>

            {showAddPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-96 relative">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={() => {
                            setError("");
                            setShowAddPopup(false)
                            }}>
                            <FaTimes size={18} />
                        </button>
                        <h3 className="text-xl font-bold mb-4">Add Codeforces ID</h3>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-blue-500"
                            placeholder="Eg. TyroWhizz"
                            onChange={(e) => setCfid(e.target.value)}
                        />
                        {error && <p className="text-red-500 text-sm mb-2 whitespace-pre-line">{error}</p>}
                        <div className="flex justify-between">
                            <button onClick={() => setShowAddPopup(false)} className="border border-gray-600 text-gray-300 hover:bg-gray-700 py-2 px-4 rounded-lg transition">
                                Cancel
                            </button>
                            <button onClick={onSubmit} disabled={isSubmitting} className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition">
                                {isSubmitting ? "Please wait" : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isAuth && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-96 relative">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={() => setIsAuth(false)}>
                            <FaTimes size={18} />
                        </button>
                        <h3 className="text-xl font-bold mb-4">Verify Codeforces ID</h3>
                        <p className="mb-2">Copy the string below and set it as your first name on {" "}
                            <a
                                href="https://codeforces.com/settings/social"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                Codeforces
                            </a>:</p>
                        <div className="flex items-center bg-neutral-900 p-2 rounded-md mb-4">
                            <input type="text" value={verifyString} className="bg-transparent w-full text-white" readOnly />
                            <button onClick={copyText} className="text-blue-400 hover:text-blue-500 ml-2">
                                {isCopied ? <FaCheck /> : <FaClipboard />}
                            </button>
                        </div>
                        <p className="mb-2">
                            And then click on Submit below
                        </p>
                        {error && <p className="text-red-500 text-sm mb-2 whitespace-pre-line">{error}</p>}
                        <button onClick={verifyCFID} disabled={isSubmitting} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition">
                            {isSubmitting ? "Verifying..." : "Submit"}
                        </button>
                    </div>
                </div>
            )}

            {confirmPopup !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="bg-gray-900 p-6 rounded-lg relative flex flex-col">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={() => setConfirmPopup(null)}>
                                <FaTimes size={18} />
                        </button>
                        <p className="mb-6 mt-2 text-lg">Are you sure you want to remove this Codeforces ID?</p>
                        <div className="flex justify-between">
                            <button onClick={() => setConfirmPopup(null)} className="border border-gray-600 text-gray-300 hover:bg-gray-700 py-2 px-4 rounded-lg transition">
                                    Cancel
                            </button>
                            <button onClick={() => removeCfid(confirmPopup)} className="bg-red-600 text-white px-4 py-2 rounded-lg self-center">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cfid;
