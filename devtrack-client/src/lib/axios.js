import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5003/api",
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
