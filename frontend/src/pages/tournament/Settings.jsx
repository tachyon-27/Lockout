import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { socket } from "@/socket";

function Settings() {
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get("id");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [isShown, setIsShown] = useState(true);
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [fixturesGenerated, setFixturesGenerated] = useState(false);
  const [popup, setPopup] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [ascordesc, setAscordesc] = useState("");
  const [participants, setParticipants] = useState([]);
  const [customOrder, setCustomOrder] = useState([]);

  const moveParticipant = (index, direction) => {
    if (index < 0 || index >= customOrder.length) return;
    const newOrder = [...customOrder];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newOrder.length) return;

    [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];
    setCustomOrder(newOrder);
  };

  useEffect(() => {
    const fetchTournamentStatus = async () => {
      try {
        const res = await axios.post("/api/tournament/is-tournament-shown", { tournamentId });
        setIsShown(res.data.data.isShown);
        setEndDate(res.data.data.endDate);
        setStartDate(res.data.data.startDate);
        setFixturesGenerated(res.data.data.fixturesGenerated);
        setParticipants(res.data.data.participants)
      } catch (error) {
        toast({ title: error.message });
      }
    };
    fetchTournamentStatus();
  }, []);

  useEffect(() => {
    const handleTournamentUpdate = (data) => {
        setIsShown(data.showDetails);
        setEndDate(data.endDate);
        setStartDate(data.startDate);
    }


      socket.on('tournament-start', handleTournamentUpdate);
      socket.on('tournament-end', handleTournamentUpdate);
  
  
      return () => {
        socket.off('tournament-start', handleTournamentUpdate);
        socket.off('tournament-end', handleTournamentUpdate);
      }
  
    }, [])

  const handleAction = async (action, successMessage, errorMessage) => {
    if (!tournamentId) {
      toast({ title: "Tournament not Specified!" });
      return;
    }
    
    setLoading(action);
    try {

      if(action === "end") {
        const confirmRemove = window.confirm("Are you sure you want to end this tournament?");
        if (!confirmRemove) return;
      }

      const res = await axios.post(`/api/tournament/${action}-tournament`, { tournamentId });
      toast({ title: res.data.message || successMessage });

      if (action === "show") setIsShown(true);
      if (action === "hide") setIsShown(false);
      if (action === "end") setEndDate(new Date().toISOString());
    } catch (error) {
      toast({ title: errorMessage, description: error.message });
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this tournament?")) return;
    setLoading("delete");
    try {
      await axios.post("/api/tournament/delete-tournament", { _id: tournamentId });
      toast({ title: "Tournament deleted successfully!" });
      navigate("/admin/dashboard/tournaments");
    } catch (error) {
      toast({ title: "Error deleting tournament!", description: error.message });
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateFixtures = async () => {
    if (!tournamentId) {
      toast({ title: "Tournament not Specified!" });
      return;
    }
  
    try {
      if (sortOption === "randomize") {
        const res = await axios.post("/api/tournament/randomize-participants", { tournamentId });
        setParticipants(res.data.data)
      } else if (sortOption === "sort") {
        const res = await axios.post("/api/tournament/sort-participants", {
          tournamentId,
          order: ascordesc === "ascending" ? "asc" : "desc",
        });
        setParticipants(res.data.data)
      } else if (sortOption === "custom") {
        const res = await axios.post("/api/tournament/assign-participants", {
          tournamentId,
          participants: customOrder,
        });
      }
  
      const fixturesRes = await axios.post("/api/tournament/generate-fixtures", {tournamentId});
      toast({ title: loading !== "restart" ? fixturesRes.data.message : "Tournament Restarted" });

      
      if(loading === "restart") {
        handleAction("restart", "Tournament Restarted", "Error Restarting Tournament")
      }
  
      setFixturesGenerated(true);
      setPopup("");
    } catch (error) {
      toast({ title: "Error generating fixtures!", description: error.message });
    } finally {
      setLoading(null);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center text-white p-5">
      <Card className="w-full max-w-lg shadow-xl bg-gray-900 text-white">
        <CardHeader>
          <CardTitle className="text-center">Tournament Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {new Date() < new Date(startDate) && <Button 
            onClick = {() => setPopup("generate-fixtures")}
            className="bg-orange-500 hover:bg-orange-600 transition-all"
          >
            {loading === "generate-fixtures" ? "Generating..." : "Generate Fixtures"}
          </Button>}

          {fixturesGenerated && (
            <>
              {isShown ? (
                <Button 
                  onClick={() => handleAction("hide", "Fixtures are now hidden!", "Error hiding fixtures!")}
                  disabled={loading === "hide"}
                  className="bg-yellow-500 hover:bg-yellow-600 transition-all"
                >
                  {loading === "hide" ? "Hiding..." : "Hide Fixtures"}
                </Button>
              ) : (
                <Button 
                  onClick={() => handleAction("show", "Fixtures are now visible!", "Error fetching matches!")}
                  disabled={loading === "show"}
                  className="bg-blue-500 hover:bg-blue-600 transition-all"
                >
                  {loading === "show" ? "Showing..." : "Show Fixtures"}
                </Button>
              )}

              {fixturesGenerated && new Date() < new Date(startDate) && (
                <Button 
                  onClick={() => handleAction("start", "Tournament started!", "Error starting tournament!")}
                  disabled={loading === "start"}
                  className="bg-green-500 hover:bg-green-600 transition-all"
                >
                  {loading === "start" ? "Starting..." : "Start Tournament"}
                </Button>
              )}
            </>
          )}

          {!endDate && new Date() >= new Date(startDate) && (
            <Button 
              onClick={() => handleAction("end", "Tournament ended!", "Error ending tournament!")}
              disabled={loading === "end"}
              className="bg-red-500 hover:bg-red-600 transition-all"
            >
              {loading === "end" ? "Ending..." : "End Tournament"}
            </Button>
          )}

          <Button 
            onClick={() => navigate(`/admin/dashboard/update-tournament?id=${tournamentId}`)}
            className="bg-purple-500 hover:bg-purple-600 transition-all"
          >
            Edit Tournament
          </Button>
          
          <Button 
            onClick={handleDelete}
            disabled={loading === "delete"}
            className="bg-red-700 hover:bg-red-800 transition-all"
          >
            {loading === "delete" ? "Deleting..." : "Delete Tournament"}
          </Button>

          {!endDate && new Date() >= new Date(startDate) && <Button
            onClick={() => setPopup("generate-fixtures")}
            disabled={loading === "restart"}
            className="bg-red-800 hover:bg-red-900 transition-all"
          >
            {loading === "restart" ? "Restarting..." : "Restart Tournament!"}
          </Button>}
        </CardContent>
      </Card>
      
      {popup === "generate-fixtures" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-5">
          <div className="bg-gray-900 p-5 rounded-lg shadow-lg text-white w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Generate Fixtures</h3>
            <div className="space-y-2">
              <label className="block">
                <input type="radio" value="randomize" checked={sortOption === "randomize"} onChange={() => setSortOption("randomize")} /> Randomize
              </label>
              <label className="block">
                <input type="radio" value="sort" checked={sortOption === "sort"} onChange={() => setSortOption("sort")} /> Sort
              </label>
              {sortOption === "sort" && (
                <div className="pl-4 space-y-1">
                  <label className="block">
                    <input type="radio" value="ascending" checked={ascordesc === "ascending"} onChange={() => setAscordesc("ascending")} /> Ascending
                  </label>
                  <label className="block">
                    <input type="radio" value="descending" checked={ascordesc === "descending"} onChange={() => setAscordesc("descending")} /> Descending
                  </label>
                </div>
              )}
              <label className="block">
                <input type="radio" value="custom" checked={sortOption === "custom"} onChange={() => { setSortOption("custom"); setCustomOrder([...participants]); }} /> Custom
              </label>
            </div>
            <div className="flex justify-between mt-4">
              <Button onClick={() => setPopup("")} variant="outline">Cancel</Button>
              {sortOption === "custom" ? (
                <Button onClick={() => setPopup("custom-order")}>Next</Button>
              ) : (
                <Button onClick={handleGenerateFixtures}>Confirm</Button>
              )}
            </div>
          </div>
        </div>
      )}

      {popup === "custom-order" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-5">
          <div className="bg-gray-900 p-5 rounded-lg shadow-lg text-white w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Reorder Participants</h3>
            <ul className="space-y-2">
              {customOrder.map((p, index) => (
                <li key={p.id} className="flex items-center justify-between bg-gray-800 p-2 rounded-lg">
                  <span>{p.name}</span>
                  <div className="space-x-2">
                    <Button size="sm" onClick={() => moveParticipant(index, "up")} disabled={index === 0}>↑</Button>
                    <Button size="sm" onClick={() => moveParticipant(index, "down")} disabled={index === customOrder.length - 1}>↓</Button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-4">
              <Button onClick={() => setPopup("generate-fixtures")} variant="outline">Back</Button>
              <Button onClick={handleGenerateFixtures}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
