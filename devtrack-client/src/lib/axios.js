import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
    console.error("CRITICAL: VITE_API_URL is missing. API calls will fail.");
}

const api = axios.create({
    baseURL: API_BASE ? `${API_BASE}/api` : "",
});

// ✅ Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

// ✅ Handle 401 — clear session and redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default api;
