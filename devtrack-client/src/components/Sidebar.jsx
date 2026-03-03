import { NavLink, useNavigate } from "react-router-dom";
import { BarChart3, LogOut, Code2, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/");
    };

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "DT";

    return (
        <aside className="w-64 flex-shrink-0 bg-[#0d0d1a] border-r border-white/5 flex flex-col h-full">
            {/* Logo */}
            <div className="px-6 py-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                        <Code2 size={16} className="text-white" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">
                        Dev<span className="text-violet-400">Track</span>
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                <p className="text-xs font-semibold text-white/20 uppercase tracking-widest px-3 mb-3">
                    Menu
                </p>
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                            ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                            : "text-white/50 hover:text-white/80 hover:bg-white/5"
                        }`
                    }
                >
                    <Home size={17} />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/dashboard"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
                >
                    <BarChart3 size={17} />
                    Analytics
                    <span className="ml-auto text-xs bg-white/5 text-white/30 px-2 py-0.5 rounded-full">
                        Soon
                    </span>
                </NavLink>
            </nav>

            {/* User & Logout */}
            <div className="px-3 py-4 border-t border-white/5 space-y-2">
                {/* User Info */}
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-medium truncate">{user?.name || "User"}</p>
                        <p className="text-white/30 text-xs truncate">{user?.role || "member"}</p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                    <LogOut size={17} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
