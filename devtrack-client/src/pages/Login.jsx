import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Code2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user?.name?.split(" ")[0] || "there"}!`);
      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Registration failed. Try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-600/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30 mb-4">
            <Code2 size={22} className="text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold">
            Dev<span className="text-violet-400">Track</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Track your coding progress</p>
        </div>

        {/* Card */}
        <div className="bg-[#0f0f1e] border border-white/8 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white text-xl font-semibold mb-1">Sign in</h2>
          <p className="text-white/40 text-sm mb-6">
            New here?{" "}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 transition-colors">
              Create an account
            </Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/4 border border-white/8 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/4 border border-white/8 rounded-xl pl-10 pr-11 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-violet-500/20"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}