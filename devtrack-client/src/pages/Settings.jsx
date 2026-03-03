import { useState, useEffect } from "react";
import { Link2, Github, Code, CheckCircle2, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { updateProfileHandles } from "../lib/analytics";

export default function Settings() {
    const { user, updateUser } = useAuth();

    const [formData, setFormData] = useState({
        leetcodeHandle: "",
        githubHandle: "",
        codeforcesHandle: "",
        bio: ""
    });
    const [isSaving, setIsSaving] = useState(false);

    // Load existing data
    useEffect(() => {
        if (user) {
            setFormData({
                leetcodeHandle: user.leetcodeHandle || "",
                githubHandle: user.githubHandle || "",
                codeforcesHandle: user.codeforcesHandle || "",
                bio: user.bio || ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const updatedUser = await updateProfileHandles(formData);
            updateUser(updatedUser);
            toast.success("Profile handles updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Layout title="Settings">
            <div className="max-w-4xl mx-auto space-y-8">

                <div className="bg-[#111120] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="mb-6 border-b border-white/5 pb-6">
                        <div className="flex items-center gap-3 text-white mb-2">
                            <Link2 className="text-violet-400" />
                            <h2 className="text-xl font-bold">Connect your Platforms</h2>
                        </div>
                        <p className="text-white/50 text-sm">
                            Link your LeetCode, Codeforces, and GitHub handles to track real 365-day heatmaps and consistency scores.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* GitHub */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
                                <Github size={16} className="text-white" />
                                GitHub Username
                            </label>
                            <input
                                type="text"
                                name="githubHandle"
                                value={formData.githubHandle}
                                onChange={handleChange}
                                placeholder="e.g. torvalds"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                            />
                        </div>

                        {/* LeetCode */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
                                <Code size={16} className="text-amber-500" />
                                LeetCode Username
                            </label>
                            <input
                                type="text"
                                name="leetcodeHandle"
                                value={formData.leetcodeHandle}
                                onChange={handleChange}
                                placeholder="e.g. hardik760"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                            />
                        </div>

                        {/* Codeforces */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
                                <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5V9c0-.828.672-1.5 1.5-1.5zm9 0c.828 0 1.5.672 1.5 1.5v10.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5V9c0-.828.672-1.5 1.5-1.5zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5v-15c0-.828.672-1.5 1.5-1.5z" />
                                </svg>
                                Codeforces Handle
                            </label>
                            <input
                                type="text"
                                name="codeforcesHandle"
                                value={formData.codeforcesHandle}
                                onChange={handleChange}
                                placeholder="e.g. tourist"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
                                Short Bio (Optional)
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Building cool things..."
                                rows="3"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all resize-none"
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all
                                    ${isSaving
                                        ? "bg-violet-600/50 cursor-not-allowed"
                                        : "bg-violet-600 hover:bg-violet-500 active:scale-95 shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]"
                                    }`}
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {isSaving ? "Saving..." : "Save Handles"}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </Layout>
    );
}
