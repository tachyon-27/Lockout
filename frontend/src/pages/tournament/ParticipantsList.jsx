import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"

const ParticipantsList = () => {
    const { toast } = useToast()
    const [searchParams] = useSearchParams();
    const tournamentId = searchParams.get("id");
    const navigate = useNavigate()

    useEffect(() => {
        if (!tournamentId) {
            console.log("Tournament ID is required in the query parameters.");
            toast({
                title: "Tournament not Specified!"
            })
            navigate('/tournaments');
        }
    }, [tournamentId, navigate])

    const data = [
        { participantName: 'Alice', maxRating: 1900 },
        { participantName: 'Bob', maxRating: 2100 },
        { participantName: 'Charlie', maxRating: 1750 },
    ];

    return (
        <div className="grid grid-cols-1 gap-y-4 p-3">
            <div className="bg-gradient-to-b from-gray-400 via-gray-500 to-gray-700 p-[0.5px] rounded-2xl flex justify-center items-center">
                <div className="grid grid-cols-3 font-bold md:gap-20 h-fit text-center border-none p-2 rounded-2xl bg-black bg-gradient-to-r from-black via-gray-400/10 to-gray-500/25 hover:bg-slate-950 text-white">
                    <span className="w-fit mr-0">S.no.</span>
                    <span className="mr-4 ml-0">Participant Name</span>
                    <span>Max Rating</span>
                </div>
            </div>

            {data.length > 0 ? (
                data.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gradient-to-b from-gray-400 via-gray-500 to-gray-700 p-[0.7px] rounded-2xl flex justify-center items-center"
                    >
                        <div className="grid grid-cols-3 p-2 gap-x-5 h-fit w-full text-center rounded-2xl bg-black bg-gradient-to-r from-black via-gray-400/10 to-gray-500/25 hover:bg-slate-950 text-white">
                            <span className="w-fit mr-0">{index + 1}</span>
                            <span className="mr-4 ml-0">{item.participantName}</span>
                            <span>{item.maxRating}</span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center p-4  text-orange-900 font-semibold">
                    No participants found.
                </div>
            )}
        </div>
    );
};

export default ParticipantsList;
