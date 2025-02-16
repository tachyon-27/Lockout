import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { FaTimes } from 'react-icons/fa';

const Cfid = () => {
    const [cfids, setCfids] = useState([]);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showVerifyPopup, setShowVerifyPopup] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [handle, setHandle] = useState('');
    const [verifyString, setVerifyString] = useState('');
    const [cfid, setCfid] = useState("");
    const [isValid, setIsValid] = useState(true);
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
            setIsValid(false);
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyText = () => {
        navigator.clipboard.writeText(verifyString)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 1000);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <div className="p-4 w-[60%]">
            <h2 className="text-xl mb-4">CFIDs</h2>
            <ul className="list-disc space-y-2">
                {cfids.length > 0 ? (
                    cfids.map((cfid, index) => (
                        <li key={index} className="text-white flex justify-between items-center bg-gray-700 p-2 rounded hover:bg-gray-600">
                            {cfid.cfid}
                            <button onClick={() => removeCfid(index)} className="text-red-500 hover:text-red-700">
                                <FaTimes />
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-400">No CFIDs available</li>
                )}
            </ul>
            <Button onClick={() => setShowAddPopup(true)} className="mt-4">Add CFID</Button>
            
            {showAddPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-1/3">
                        <h3 className="text-lg font-bold mb-4">Add CFID</h3>
                        <input type="text" className="w-full p-2 rounded bg-gray-800 text-white mb-4" placeholder="Enter CFID" onChange={(e) => setCfid(e.target.value)} />
                        <div className="flex justify-between">
                            <Button onClick={() => setShowAddPopup(false)} variant="outline">Cancel</Button>
                            <Button onClick={onSubmit} disabled={isSubmitting}>{isSubmitting ? "Please wait" : "Confirm"}</Button>
                        </div>
                    </div>
                </div>
            )}

            {isAuth && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-1/3">
                        <h3 className="text-lg font-bold mb-4">Verify CFID</h3>
                        <ul className="list-disc space-y-2">
                            <li>Copy the below String</li>
                            <div className="w-full flex justify-between bg-neutral-900 p-1 rounded-md">
                                <input type="text" value={verifyString} className="hover:bg-neutral-950 bg-neutral-900" readOnly />
                                <button onClick={copyText} className="flex items-center justify-center p-1">
                                    {isCopied ? "✔" : "📋"}
                                </button>
                            </div>
                            <li>Add the above String as your first name in Codeforces and Save</li>
                            <span> Go to <a href="https://codeforces.com/settings/social" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">Codeforces</a> </span>
                            <li>Now verify your codeforces handle</li>
                        </ul>
                        <Button onClick={onSubmit} disabled={isSubmitting}>{isSubmitting ? "Please wait" : "Submit"}</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cfid;
