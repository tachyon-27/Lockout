import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'
import { RingLoader } from 'react-spinners';

const ParticipantsList = () => {
    const { toast } = useToast();
    const [searchParams] = useSearchParams();
    const tournamentId = searchParams.get("id");
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(async () => {
        if (!tournamentId) {
            console.log("Tournament ID is required in the query parameters.");
            toast({
                title: "Tournament not Specified!"
            })
            navigate('/tournaments');
        }

        try {
            const response = await axios.post('/api/tournament/get-participants', {
                _id: tournamentId,
            })

            if (response.data.success) {
                // const y = [
                //     {
                //         name: "as",
                //         maxRating: 2,
                //     },
                //     {
                //         name: "as",
                //         maxRating: 1,
                //     },
                //     {
                //         name: "as",
                //         maxRating: 4,
                //     },
                //     {
                //         name: "as",
                //         maxRating: 3,
                //     }
                // ]
                const sortedParticipants = response.data.data.sort(
                    (a, b) => b.maxRating - a.maxRating
                );
                setParticipants(sortedParticipants);

            } else {
                setErr(response.data.message || "Failed to fetch participants")
            }

        } catch (error) {
            console.log(error)
            toast({
                title: "Error occured while fetching participants!",
                description: error.message,
            })
            navigate('/tournaments')
        } finally {
            setIsLoading(false)
        }



    }, [tournamentId, navigate, toast])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center">
                <RingLoader size={100} color="#2563EB" />
            </div>
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
                    <div className="grid grid-cols-3 font-bold h-fit text-center border-none p-2 rounded-2xl bg-black bg-gradient-to-r from-black via-gray-400/10 to-gray-500/25 hover:bg-slate-950 text-white">
                        <span>S.no.</span>
                        <span>Participant Name</span>
                        <span>Max Rating</span>
                    </div>
                </div>

                {participants.length > 0 ? (
                    participants.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-b from-gray-400 w-full via-gray-500 to-gray-700 p-[0.7px] rounded-2xl"
                        >
                            <div className="grid grid-cols-3 p-2 h-fit text-center rounded-2xl bg-black bg-gradient-to-r from-black via-gray-400/10 to-gray-500/25 hover:bg-slate-950 text-white">
                                <span>{index + 1}</span>
                                <span>{item.name}</span>
                                <span>{item.maxRating}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-4 text-orange-900 font-semibold">
                        No participants found.
                    </div>
                )}
            </div>
        </div>

    );
};

export default ParticipantsList;
