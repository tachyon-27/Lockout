import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {Loader} from "@/components";

const MatchSettingsActions = ({ setPopupType, loading, match }) => (
    <CardContent className="flex flex-col space-y-4">
        {match?.state === "SCHEDULED" && <Button onClick={() => setPopupType("start")} disabled={loading}>Start Match</Button>}
        {(match?.state === "RUNNING" || match?.state === "DONE") &&  <Button onClick={() => setPopupType("restart")} disabled={loading} variant="outline">Restart Match</Button>}
        {(match?.state === "RUNNING" || match.state == "TIE") && <Button onClick={() => setPopupType("end")} disabled={loading} variant="destructive">End Match</Button>}
        {match?.state === "TIE" && (!match?.winner || match.winner === "DRAW") && <Button onClick={() => setPopupType("tie")} disabled={loading} variant="secondary">Tie Handling</Button>}
        {match?.state === "SCHEDULED" && <Button onClick={() => setPopupType("bye")} disabled={loading} variant="outline">Give Bye</Button>}
        {match?.state === "RUNNING" && <Button onClick={() => setPopupType("addDuration")} disabled={loading} variant="outline">Add Duration</Button>}
    </CardContent>
);

const AddDurationPopup = ({ additionalDuration, setAdditionalDuration, err, setErr, handleMatchAction, loading, setPopupType }) => (
    <>
        <h3 className="text-lg font-bold mb-4">Add Duration</h3>
        <InputField
            label="Additional Duration (minutes)"
            type="number"
            value={additionalDuration}
            onChange={(e) => setAdditionalDuration(e.target.value)}
            placeholder="Enter minutes to add"
        />
        <p className="text-sm text-red-600 mb-2">{err}</p>
        <div className="flex justify-between">
            <Button onClick={() => { setPopupType(null); setErr(""); }} variant="outline">Cancel</Button>
            <Button
                onClick={() => handleMatchAction("Add Duration", "/api/tournament/add-duration", { duration: parseFloat(additionalDuration) })}
                disabled={loading}
            >
                Confirm
            </Button>
        </div>
    </>
);

const InputField = ({ label, value, onChange, type = "number", placeholder = "" }) => (
    <div className="mb-4">
        <label className="block mb-2">{label}:</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            placeholder={placeholder}
        />
    </div>
);

const ByePopup = ({ participants, selectedParticipant, setSelectedParticipant, handleMatchAction, loading, err, setPopupType, setErr }) => (
    <>
        <h3 className="text-lg font-bold mb-4">Give Bye</h3>
        <label className="block mb-2">Select Participant:</label>
        <select
            value={selectedParticipant}
            onChange={(e) => setSelectedParticipant(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 mb-4"
        >
            <option value="">Select a participant</option>
            {participants?.map((participant) => (
                <option key={participant.id} value={participant.id}>{participant.name}</option>
            ))}
        </select>
        <p className="text-sm text-red-600 mb-2">{err}</p>
        <div className="flex justify-between">
            <Button onClick={() => { setPopupType(null); setErr(""); }} variant="outline">Cancel</Button>
            <Button
                onClick={() => handleMatchAction("Give Bye", "/api/tournament/give-bye", { byeTo: selectedParticipant })}
                disabled={loading}
            >
                Confirm
            </Button>
        </div>
    </>
);

const TieHandlingPopup = ({ 
    tieOption, 
    setTieOption, 
    customTieBreaker, 
    setCustomTieBreaker, 
    customTitle, 
    setCustomTitle, 
    err, 
    setErr, 
    handleMatchAction, 
    loading, 
    setPopupType, 
    startingRating, 
    setStartingRating, 
    duration, 
    setDuration, 
    availableTieBreakers 
}) => {
    const [selectedTieBreaker, setSelectedTieBreaker] = useState(""); 

    const handleTieBreakerChange = (e) => {
        const selectedId = e.target.value;
        setSelectedTieBreaker(selectedId);

        if (selectedId) {
            const selected = availableTieBreakers.find(tb => tb.title === selectedId);
            setCustomTitle(selected?.title || "");
            setCustomTieBreaker(selected?.question || "");
        } else {
            setCustomTitle("");
            setCustomTieBreaker("");
        }
    };

    return (
        <>
            <h3 className="text-lg font-bold mb-4">Tie Handling</h3>
            <div className="flex space-x-4 mb-4">
                <label>
                    <input type="radio" value="restart" checked={tieOption === "restart"} onChange={() => setTieOption("restart")} /> Restart Match
                </label>
                <label>
                    <input type="radio" value="custom" checked={tieOption === "custom"} onChange={() => setTieOption("custom")} /> Custom Tie Breaker
                </label>
            </div>

            {tieOption === "custom" ? (
                <>
                    <label className="block mb-2">Select an Existing Tie-Breaker:</label>
                    <select 
                        value={selectedTieBreaker} 
                        onChange={handleTieBreakerChange} 
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700 mb-4"
                    >
                        <option value="">-- Select Tie-Breaker --</option>
                        {availableTieBreakers.map((tb, index) => (
                            <option key={index} value={tb.title}>{tb.title}</option>
                        ))}
                    </select>

                    <InputField 
                        label="Title" 
                        type="text" 
                        value={customTitle} 
                        onChange={(e) => setCustomTitle(e.target.value)} 
                        disabled={selectedTieBreaker !== ""}
                    />
                    <textarea
                        value={customTieBreaker}
                        onChange={(e) => setCustomTieBreaker(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700 mb-4"
                        placeholder="Enter tie breaker details"
                        rows="4"
                        disabled={selectedTieBreaker !== ""}
                    ></textarea>
                </>
            ) : (
                <>
                    <InputField label="Starting Rating" value={startingRating} onChange={(e) => setStartingRating(e.target.value)} />
                    <InputField label="Duration (minutes)" value={duration} onChange={(e) => setDuration(e.target.value)} />
                </>
            )}

            <p className="text-sm text-red-600 mb-2">{err}</p>
            <div className="flex justify-between">
                <Button onClick={() => { setPopupType(null); setErr(""); }} variant="outline">Cancel</Button>
                <Button 
                    onClick={() => handleMatchAction(
                        "Tie Handling", 
                        tieOption === "custom" ? "/api/tournament/tie-break" : "/api/tournament/start-match", 
                        tieOption === "custom" 
                            ? { title: customTitle, question: customTieBreaker } 
                            : { startingRating, duration }
                    )} 
                    disabled={loading}
                >
                    Confirm
                </Button>
            </div>
        </>
    );
};

const EndMatchPopup = ({ selectedWinner, setSelectedWinner, match, err, setErr, handleMatchAction, loading, setPopupType }) => (
    <>
        <h3 className="text-lg font-bold mb-4">End Match</h3>
        <label className="block mb-2">Select Winner:</label>
        <select className="w-full p-2 rounded bg-gray-800 border border-gray-700 mb-4" value={selectedWinner} onChange={(e) => setSelectedWinner(e.target.value)}>
            <option value="">Select a winner</option>
            {match?.participants?.map((participant) => (
                <option key={participant.id} value={participant.id}>{participant.name}</option>
            ))}
        </select>
        <p className="text-sm text-red-600 mb-2">{err}</p>

        <div className="flex justify-between">
            <Button onClick={() => { setPopupType(null); setErr(""); }} variant="outline">Cancel</Button>
            <Button onClick={() => handleMatchAction("End Match", "/api/tournament/end-match", { winner: selectedWinner })} disabled={loading}>Confirm</Button>
        </div>
    </>
);

const MatchSettings = ({setOpenMatchSettings}) => {
    const [searchParams] = useSearchParams();
    const tournamentId = searchParams.get("tournamentId");
    const matchId = searchParams.get("matchId");
    const [match, setMatch] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [startingRating, setStartingRating] = useState(800);
    const [duration, setDuration] = useState(15);
    const [tieOption, setTieOption] = useState("restart");
    const [customTieBreaker, setCustomTieBreaker] = useState("");
    const [availableTieBreakers, setAvailableTieBreakers] = useState([]);
    const [customTitle, setCustomTitle] = useState("");
    const [selectedParticipant, setSelectedParticipant] = useState("");
    const [selectedWinner, setSelectedWinner] = useState("");
    const [additionalDuration, setAdditionalDuration] = useState("");
    const [err, setErr] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const response = await axios.post("/api/tournament/get-match", { _id: tournamentId, matchId, tieBreaker: true });
                setMatch(response.data.data.match);
                setAvailableTieBreakers(response.data.data.tieBreakers);
                console.log(response.data.data)
            } catch (error) {
                toast({ title: "Error fetching match data" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchMatch();
    }, [tournamentId, matchId]);

    const handleMatchAction = async (action, endpoint, data = {}) => {
        setLoading(true);
        console.log(data)
        if (action === "Add Duration" && (!data.duration || isNaN(data.duration))) {
            setErr("Please enter a valid duration!");
            setLoading(false);
            return;
        }
        if (action === "Tie Handling" && (data.question === '' || data.title === '')) {
            setErr("Please specify the custom tie breaker!");
            setLoading(false);
            return;
        }
        if (action === "Tie Handling" && (data.startingRating === '' || data.duration === '')) {
            setErr("Please specify the all the fields!");
            setLoading(false);
            return;
        }
        if (action === "End Match" && !data.winner) {
            setErr("Please specify the Winner!");
            setLoading(false);
            return;
        }
        if (action === "Give Bye" && !data.byeTo) {
            setErr("Please select a participant!");
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post(endpoint, {
                tournamentId,
                matchId,
                ...data,
            })

            if (response.data.success) {
                toast({
                    title: `${action} successful`
                });
                setMatch(response.data.data)
                if (action === "Add Duration") {
                    setMatch(prevMatch => ({
                        ...prevMatch,
                        duration: prevMatch.duration + parseInt(data.duration, 10),
                    }));
                }
                
            } else {
                toast({
                    title: response.data.message,
                })
            }

        } catch (error) {
            console.log(error)
            toast({
                title: `Failed to ${action}`,
                description: "Server Error!"
            });
        } finally {
            setOpenMatchSettings(false);
            setLoading(false);
            setPopupType(null);
            setErr("");
        }
    };

    if (isLoading) return <Loader/>;

    return (
        <div className="flex flex-col items-center justify-center text-white p-5">
            <Card className="w-full max-w-lg shadow-xl">
                <CardHeader>
                    <CardTitle className="text-center text-white">Match Settings</CardTitle>
                </CardHeader>
                <MatchSettingsActions setPopupType={setPopupType} loading={loading} match={match} />
            </Card>
            {popupType && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[502]">
                    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-1/3">
                        {popupType === "start" || popupType === "restart" ? (
                            <>
                                <h3 className="text-lg font-bold mb-4">{popupType === "start" ? "Start Match" : "Restart Match"}</h3>
                                <InputField label="Starting Rating" value={startingRating} onChange={(e) => setStartingRating(e.target.value)} />
                                <InputField label="Duration (minutes)" value={duration} onChange={(e) => setDuration(e.target.value)} />
                                <p className="text-sm text-red-600 mb-2">{err}</p>
                                <div className="flex justify-between">
                                    <Button onClick={() => { setPopupType(null); setErr("") }} variant="outline">Cancel</Button>
                                    <Button onClick={() => handleMatchAction(popupType === "start" ? "Start Match" : "Restart Match", "/api/tournament/start-match", { startingRating, duration })} disabled={loading}>Confirm</Button>
                                </div>
                            </>
                        ) : popupType === "tie" ? (
                            <TieHandlingPopup
                                tieOption={tieOption}
                                setTieOption={setTieOption}
                                customTieBreaker={customTieBreaker}
                                setPopupType={setPopupType}
                                setErr={setErr}
                                customTitle={customTitle}
                                setCustomTitle={setCustomTitle}
                                setStartingRating={setStartingRating}
                                startingRating={startingRating}
                                duration={duration}
                                setDuration={setDuration}
                                setCustomTieBreaker={setCustomTieBreaker}
                                err={err}
                                handleMatchAction={handleMatchAction}
                                loading={loading}
                                availableTieBreakers={availableTieBreakers}
                            />
                        ) : popupType === "end" ? (
                            <EndMatchPopup
                                setErr={setErr}
                                selectedWinner={selectedWinner}
                                setPopupType={setPopupType}
                                setSelectedWinner={setSelectedWinner}
                                match={match}
                                err={err}
                                handleMatchAction={handleMatchAction}
                                loading={loading}
                            />
                        ) : popupType === "bye" ? (
                            <ByePopup
                                setPopupType={setPopupType}
                                setErr={setErr}
                                selectedParticipant={selectedParticipant}
                                participants={match?.participants}
                                setSelectedParticipant={setSelectedParticipant}
                                handleMatchAction={handleMatchAction}
                                loading={loading}
                                err={err}
                            />
                        ) : popupType === "addDuration" ? (
                            <AddDurationPopup
                                additionalDuration={additionalDuration}
                                setAdditionalDuration={setAdditionalDuration}
                                setErr={setErr}
                                err={err}
                                handleMatchAction={handleMatchAction}
                                loading={loading}
                                setPopupType={setPopupType}
                            />
                        ) : null}
                
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchSettings;
