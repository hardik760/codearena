import { io } from "socket.io-client";

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
    console.error("CRITICAL: VITE_API_URL is missing. WebSocket connection will fail.");
}

const socket = io(API_BASE || "", {
    transports: ["websocket"]
});

export default socket;