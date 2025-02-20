import { Outlet } from "react-router-dom"
import { Navbar } from "@/components"

function Layout() {
    return (
        <div className="flex flex-col min-h-screen items-center w-full">
            <Navbar />
            <main className="w-full h-full" >
                <Outlet />
            </main>
        </div>
    )
}

export default Layout