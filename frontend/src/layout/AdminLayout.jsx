import { Outlet } from "react-router-dom";
import { SideBar } from "@/components"; // Ensure you have a SideBar component
import { cn } from "@/lib/utils";

function AdminLayout() {
    return (
        <div
          className={cn(
            "flex flex-col md:flex-row w-full flex-1 mx-auto border bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white overflow-hidden min-h-screen relative"
          )}
        >
            <SideBar />
            <main className="flex-grow transition-all duration-300">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
