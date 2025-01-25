import { Outlet } from "react-router-dom"
import { Navbar, Footer } from "@/components"

function Layout() {
    return (
        <div className="flex flex-col min-h-screen items-center w-full">
            <Navbar />
            <main className="flex-grow w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout