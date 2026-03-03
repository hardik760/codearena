import api from "./axios";

export const getDeveloperStats = async () => {
    const res = await api.get("/analytics/stats");
    return res.data;
};

export const updateProfileHandles = async (data) => {
    const res = await api.post("/analytics/profile", data);
    return res.data;
};

export const analyzeResume = async (formData) => {
    const res = await api.post("/analytics/resume/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
};
