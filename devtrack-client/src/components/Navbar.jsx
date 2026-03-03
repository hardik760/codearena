import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import socket from "../socket";

export default function Navbar({ title = "Dashboard" }) {
    const { user } = useAuth();
    const [connected, setConnected] = useState(socket.connected);

    useEffect(() => {
        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    return (
        <header className="h-16 flex-shrink-0 bg-[#0d0d1a]/80 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between">
            {/* Left */}
            <div>
                <h1 className="text-white font-semibold text-base">{title}</h1>
                <p className="text-white/30 text-xs">
                    {greeting}, {user?.name?.split(" ")[0] || "there"} 👋
                </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                {/* Socket status */}
                <div
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${connected
                            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : "text-red-400 bg-red-500/10 border-red-500/20"
                        }`}
                >
                    {connected ? (
                        <>
                            <Wifi size={11} />
                            Live
                        </>
                    ) : (
                        <>
                            <WifiOff size={11} />
                            Offline
                        </>
                    )}
                </div>

                {/* Date */}
                <span className="text-white/30 text-xs hidden sm:block">
                    {new Date().toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                    })}
                </span>
            </div>
        </header>
    );
}
