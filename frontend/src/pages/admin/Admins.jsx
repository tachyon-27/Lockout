import { useEffect, useMemo, useState } from 'react';
import { useToast } from "@/hooks/use-toast"
import axios from 'axios';
import {Loader} from '@/components';

const Admins = () => {
    const { toast } = useToast();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [err, setErr] = useState("");
    const [isConfirming, setIsConfirming] = useState(false);
    const [userToConfirm, setUserToConfirm] = useState(null);

    const filteredUsers = useMemo(() => {
        return users
            .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => {
                if (a.isAdmin === b.isAdmin) {
                    const lowerSearch = search.toLowerCase();
                    const aStarts = a.name.toLowerCase().startsWith(lowerSearch);
                    const bStarts = b.name.toLowerCase().startsWith(lowerSearch);
                    return aStarts === bStarts ? 0 : aStarts ? -1 : 1;
                }
                return a.isAdmin ? -1 : 1;
            });
    }, [search, users]);

    const remove = async (email) => {
        try {
            setIsLoading(true);
            setErr("");
            const res = await axios.post('/api/admin/remove-admin', { email });
            toast({ title: res.data.message });
        } catch (error) {
            console.error(error);
            toast({ title: "Error occurred while demoting admin!", description: error.response.data.message || error.message });
        } finally {
            setIsConfirming(false);
            setIsLoading(false);
        }
    };

    const add = async (email) => {
        try {
            setIsLoading(true);
            setErr("");
            const res = await axios.post('/api/admin/add-admin', { email });
            toast({ title: res.data.message });
        } catch (error) {
            console.error(error);
            toast({ title: "Error occurred while promoting to admin!", description: error.response.data.message || error.message });
        } finally {
            setIsConfirming(false);
            setIsLoading(false);
        }
    };

    const handleActionClick = (user) => {
        setUserToConfirm(user); 
        setIsConfirming(true); 
    };

    const handleCancel = () => {
        setIsConfirming(false); 
        setUserToConfirm(null);
    };

    const confirmAction = () => {
        const updatedUsers = [...users];
        if (userToConfirm?.isAdmin) {
            updatedUsers.forEach(user => {
                if (user.email === userToConfirm.email) {
                    user.isAdmin = false;
                }
            });
            setUsers(updatedUsers);
            remove(userToConfirm.email);
        } else {
            updatedUsers.forEach(user => {
                if (user.email === userToConfirm.email) {
                    user.isAdmin = true;
                }
            });
            setUsers(updatedUsers);
            add(userToConfirm.email);
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('/api/user/get-users');
                if (res.data.success) {
                    setUsers(res.data.data);
                } else {
                    setErr(res.data.message || "Failed to fetch participants");
                }
            } catch (error) {
                console.error(error);
                toast({ title: "Error occurred while fetching participants!", description: error.message });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (isLoading) {
        return (
            <Loader />
        );
    }

    if (err) {
        return (
            <div className="flex items-center justify-center text-red-500">
                <p>{err}</p>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className="grid gap-y-4 p-3 sm:w-full md:w-[80%]">
                <div className="bg-gradient-to-b from-gray-400 w-full via-gray-500 to-gray-700 p-[0.5px] rounded-2xl">
                    <div className="flex items-center gap-2 h-fit border-none p-2 rounded-2xl bg-black bg-gradient-to-r from-black via-gray-400/10 to-gray-500/25 hover:bg-slate-950 text-white">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent outline-none text-white placeholder-gray-300 p-2 rounded-xl"
                        />
                    </div>
                </div>

                <div className="bg-gradient-to-b from-gray-400 w-full via-gray-500 to-gray-700 p-[0.5px] rounded-2xl">
                    <div className={`grid grid-cols-[1fr_5fr_5fr_1fr] font-bold h-fit text-center border-none p-2 rounded-2xl bg-black bg-gradient-to-r from-black via-gray-400/10 to-gray-500/25 hover:bg-slate-950 text-white`}>
                        <span>S.no.</span>
                        <span>Name</span>
                        <span>Email</span>
                        <span>Actions</span>
                    </div>
                </div>

                {filteredUsers.length > 0 ? (
                    filteredUsers.map((item, index) => (
                        <div key={index} className="bg-gradient-to-b from-gray-400 w-full via-gray-500 to-gray-700 p-[0.7px] rounded-2xl">
                            <div className={`grid grid-cols-[1fr_5fr_5fr_1fr] p-2 h-fit text-center rounded-2xl bg-black bg-gradient-to-r from-black via-gray-400/10 to-gray-500/25 hover:bg-slate-950 text-white`}>
                                <span>{index + 1}</span>
                                <span>{item.name}</span>
                                <span>{item.email}</span>
                                <button
                                    className={`text-xl px-4 py-2 rounded-lg ${item.isAdmin ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                                    onClick={() => handleActionClick(item)}
                                >
                                    {item.isAdmin ? '-' : '+'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-4 text-orange-900 font-semibold">
                        No participants found.
                    </div>
                )}
            </div>

            {isConfirming && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[502]">
                    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-1/3">
                        <h3 className="text-lg font-bold mb-4">
                            Confirm {userToConfirm?.isAdmin ? 'Removal' : 'Addition'}
                        </h3>
                        <p className="mb-4">
                            Are you sure you want to {userToConfirm?.isAdmin ? 'demote' : 'promote'}{' '}
                            {userToConfirm?.name}?
                        </p>
                        <div className="flex justify-between">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                                onClick={confirmAction}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admins;
