import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

function Settings() {
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get("id");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [isShown, setIsShown] = useState(true);
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);

  useEffect(() => {
    const fetchTournamentStatus = async () => {
      try {
        const res = await axios.post('/api/tournament/is-tournament-shown', { tournamentId });
        setIsShown(res.data.data.isShown);
        setEndDate(res.data.data.endDate);
        setStartDate(res.data.data.startDate);
        console.log(res.data.data.startDate);
      } catch (error) {
        toast({ title: error.message });
      }
    };
    fetchTournamentStatus();
  }, []);

  const handleAction = async (action, successMessage, errorMessage) => {
    if (!tournamentId) {
      toast({ title: "Tournament not Specified!" });
      return;
    }
    
    setLoading(action);
    try {
      const res = await axios.post(`/api/tournament/${action}-tournament`, { tournamentId });
      toast({ title: res.data.message || successMessage });

      if (action === "show") setIsShown(true);
      if (action === "hide") setIsShown(false);
      if (action === "end") setEndDate(new Date().toISOString()); // Mark tournament as ended
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
      navigate('/admin/dashboard/tournaments');
    } catch (error) {
      toast({ title: "Error deleting tournament!", description: error.message });
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

          {!endDate && new Date() < new Date(startDate)&& (
            <Button 
              onClick={() => handleAction("start", "Tournament started!", "Error starting tournament!")}
              disabled={loading === "start"}
              className="bg-green-500 hover:bg-green-600 transition-all"
            >
              {loading === "start" ? "Starting..." : "Start Tournament"}
            </Button>
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
        </CardContent>
      </Card>
    </div>
  );
}

export default Settings;
