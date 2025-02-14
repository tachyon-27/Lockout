import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ClipLoader } from "react-spinners";

const MatchSettings = () => {
    const [searchParams] = useSearchParams();
    const tournamentId = searchParams.get("tournamentId");
    const matchId = searchParams.get("matchId");
    const [match, setMatch] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const response = await axios.post("/api/tournament/get-match", { _id: tournamentId, matchId });
                setMatch(response.data.data);
            } catch (error) {
                toast({ title: "Error fetching match data" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchMatch();
    }, [tournamentId, matchId]);

    const handleMatchAction = async (action, endpoint) => {
        setLoading(true);
        try {
            await axios.post(endpoint, {
                tournamentId,
                matchId,
                startingRating: 1500,
                duration: 60,
            });
            toast({ title: `${action} successful` });
        } catch (error) {
            toast({ title: `Failed to ${action}` });
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-10"><ClipLoader color="#fff" /></div>;

    return (
        <div className="flex flex-col items-center justify-center text-white p-5 ">
            <Card className="w-full max-w-lg shadow-xl">
                <CardHeader>
                    <CardTitle className="text-center text-white">Match Settings</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                    <Button onClick={() => handleMatchAction("Start Match", "/api/tournament/start-match")} disabled={loading}>
                        {loading ? <ClipLoader size={20} color="#fff" /> : "Start Match"}
                    </Button>
                    <Button onClick={() => handleMatchAction("Restart Match", "/api/tournament/start-match")} disabled={loading} variant="outline">
                        {loading ? <ClipLoader size={20} color="#fff" /> : "Restart Match"}
                    </Button>
                    <Button onClick={() => handleMatchAction("End Match", "/api/tournament/end-match")} disabled={loading} variant="destructive">
                        {loading ? <ClipLoader size={20} color="#fff" /> : "End Match"}
                    </Button>
                    <Button disabled variant="secondary">
                        Tie Handling (Coming Soon)
                    </Button>
                    {match && (
                        <div className="mt-6 w-full max-w-md">
                            <h2 className="text-lg font-semibold mb-2 text-white">Give Bye</h2>
                            <ul className="p-4 rounded-lg border border-gray-600">
                                {match.participants.map((participant) => (
                                    <li key={participant._id} className="flex justify-between py-2 text-white">
                                        <span>{participant.name}</span>
                                        <Button className="bg-red-600 hover:bg-red-700 cursor-not-allowed" disabled>
                                            Give Bye
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default MatchSettings;
