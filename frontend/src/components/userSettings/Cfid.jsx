import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTimes, FaClipboard, FaCheck } from 'react-icons/fa';

const Cfid = () => {
    const [cfids, setCfids] = useState([]);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [handle, setHandle] = useState('');
    const [verifyString, setVerifyString] = useState('');
    const [cfid, setCfid] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        const fetchCfids = async () => {
            try {
                const response = await axios.get('/api/user/get-cfids');
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
        const updatedCfids = cfids.filter((_, i) => i !== index);
        setCfids(updatedCfids);
    };

    const onSubmit = async () => {
        setIsSubmitting(true);
        setError("");
        try {
            await axios.get(`https://codeforces.com/api/user.info?handles=${cfid}`);
            const res = await axios.post('/api/cf/add-id', { cfid });
            setHandle(cfid);
            setVerifyString(res.data.data.verifyString);
            setShowAddPopup(false);
            setIsAuth(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const verifyCFID = async () => {
        setIsSubmitting(true);
        setError("");
        try {
            const res = await axios.post('/api/cf/verify-id', { cfid: handle });
            if (!res.data.success) {
                setError(res.data.message);
                return;
            }
            setCfids(prevCfids => [...prevCfids, res.data.data])
            setIsAuth(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message || err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyText = () => {
        navigator.clipboard.writeText(verifyString)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 1000);
            })
            .catch((error) => setError(error.message));
    };

    return (
        <div className="max-w-md mx-auto p-6 text-white">
            <h2 className="text-2xl font-semibold text-center mb-4">Manage Codeforces ID</h2>
            <ul className="space-y-2 mb-4">
                {cfids.length > 0 ? (
                    cfids.map((cfid, index) => (
                        <li key={index} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                            <span className="text-lg font-medium">{cfid.cfid}</span>
                            <button onClick={() => removeCfid(index)} className="text-red-500 hover:text-red-700">
                                <FaTimes size={18} />
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-400 text-center">No CFIDs available</li>
                )}
            </ul>
            <button onClick={() => setShowAddPopup(true)} className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2">Add CFID</button>

            {showAddPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="bg-gray-900 p-6 rounded-lg w-96">
                        <h3 className="text-xl font-bold mb-4">Add Codeforces ID</h3>
                        <input type="text" className="w-full p-2 rounded bg-gray-800 text-white mb-4" placeholder="Enter CFID" onChange={(e) => setCfid(e.target.value)} />
                        <div className="flex justify-between">
                            <button onClick={() => setShowAddPopup(false)} className="bg-gray-600 text-white rounded-lg px-3 py-2">Cancel</button>
                            <button onClick={onSubmit} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-2">{isSubmitting ? "Please wait" : "Confirm"}</button>
                        </div>
                    </div>
                </div>
            )}

            {isAuth && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="bg-gray-900 p-6 rounded-lg w-96">
                        <h3 className="text-xl font-bold mb-4">Verify CFID</h3>
                        <p className="mb-2">Copy the string below and set it as your first name on Codeforces:</p>
                        <div className="flex items-center bg-gray-800 p-2 rounded-md mb-4">
                            <input type="text" value={verifyString} className="bg-transparent w-full text-white" readOnly />
                            <button onClick={copyText} className="text-blue-400 hover:text-blue-500 ml-2">
                                {isCopied ? <FaCheck /> : <FaClipboard />}
                            </button>
                        </div>
                        <p className="mb-2">Go to <a href="https://codeforces.com/settings/social" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Codeforces Settings</a> and update your first name.</p>
                        <p className="mb-2">Then click below to verify:</p>
                        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                        <button onClick={verifyCFID} disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg p-2">{isSubmitting ? "Verifying..." : "Submit"}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cfid;
