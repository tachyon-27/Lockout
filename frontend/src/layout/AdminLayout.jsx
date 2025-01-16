import { Outlet } from "react-router-dom"
import { SideBar } from "@/components"
import { cn } from "@/lib/utils";

function AdminLayout() {
    return (
        <div
          className={cn(
            "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen"
          )}>
            <SideBar />
             <main className="flex-grow">
                 <Outlet />
             </main>
        </div>
    )
}

export default AdminLayout