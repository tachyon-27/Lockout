import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";
import axios from "axios";
import { Loader } from "@/components";

const ProfileSettings = () => {
  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/user/get-loggedin-user");
      setUser(res.data.data);
      setNewName(res.data.data.name);
    } catch (error) {
      toast({ title: "Failed to fetch user data" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleNameChange = async () => {
    if (newName.trim() === "") {
      toast({ title: "Name cannot be empty" });
      return;
    }

    try {
      const res = await axios.post("/api/user/edit-name", { name: newName });

      toast({ title: res.data.message });

      if (res.data.success) {
        fetchUser();
      }
    } catch (error) {
      toast({ title: "Failed to update name" });
    } finally {
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 text-white w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>

      <div className="w-full flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow">
        {isEditing ? (
          <div className="flex items-center space-x-3 w-full">
            <input
              type="text"
              className="p-2 bg-gray-700 text-white border rounded-md w-full"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition"
              onClick={handleNameChange}
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-gray-500 rounded-md hover:bg-gray-600 transition"
              onClick={() => {
                setIsEditing(false);
                setNewName(user.name);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-3">
              <p className="text-xl font-semibold">{user?.name}</p>
              <button onClick={() => setIsEditing(true)}>
                <Pencil size={20} className="text-gray-400 hover:text-white transition" />
              </button>
            </div>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
