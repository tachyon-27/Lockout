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
        <div className='flex flex-col items-center justify-center'>

        <div className="grid gap-y-4 p-3 sm:w-full md:w-[80%]">
            {/* Header Row */}
            <div className="bg-gradient-to-b from-gray-400 w-full via-gray-500 to-gray-700 p-[0.5px] rounded-2xl">
                <div className="grid grid-cols-3 font-bold h-fit text-center border-none p-2 rounded-2xl bg-black bg-gradient-to-r from-black via-gray-400/10 to-gray-500/25 hover:bg-slate-950 text-white">
                    <span>S.no.</span>
                    <span>Participant Name</span>
                    <span>Max Rating</span>
                </div>
            </div>

            {/* Data Rows */}
            {data.length > 0 ? (
                data.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gradient-to-b from-gray-400 w-full via-gray-500 to-gray-700 p-[0.7px] rounded-2xl"
                    >
                        <div className="grid grid-cols-3 p-2 h-fit text-center rounded-2xl bg-black bg-gradient-to-r from-black via-gray-400/10 to-gray-500/25 hover:bg-slate-950 text-white">
                            <span>{index + 1}</span>
                            <span>{item.participantName}</span>
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
