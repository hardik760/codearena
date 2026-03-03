import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children, title }) {
    return (
        <div className="flex h-screen bg-[#08080f] overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-col flex-1 min-w-0">
                <Navbar title={title} />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
