import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";

const ProfileSettings = () => {
  const [username, setUsername] = useState("JohnDoe"); // Placeholder for username
  const [newName, setNewName] = useState(username);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleNameChange = () => {
    if (newName.trim() === "") {
      toast({ title: "Name cannot be empty" });
      return;
    }
    setUsername(newName);
    toast({ title: "Name updated successfully!" });
    setIsEditing(false);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="flex items-center space-x-3">
        {isEditing ? (
          <>
            <input
              type="text"
              className="p-2 bg-gray-800 text-white border rounded-md"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600"
              onClick={handleNameChange}
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-gray-500 rounded-md hover:bg-gray-600"
              onClick={() => {
                setIsEditing(false);
                setNewName(username);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <p className="text-xl">{username}</p>
            <button onClick={() => setIsEditing(true)}>
              <Pencil size={20} className="text-gray-400 hover:text-white" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
