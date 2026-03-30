import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sprout, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

export default function AuthPage() {
  const [searchParams]   = useSearchParams();
  const [isSignup,       setIsSignup]       = useState(searchParams.get("signup") === "true");
  const [email,          setEmail]          = useState("");
  const [password,       setPassword]       = useState("");
  const [showPass,       setShowPass]       = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState("");
  const [successMsg,     setSuccessMsg]     = useState("");

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate("/dashboard"); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      if (isSignup) {
        const { error: err } = await signUp(email, password);
        if (err) throw err;
        setSuccessMsg("Account created! Check your email to confirm, then sign in.");
        setIsSignup(false);
      } else {
        const { error: err } = await signIn(email, password);
        if (err) throw err;
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Card */}
        <div className="glass-green p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sprout size={28} className="text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {isSignup ? "Start farming smarter today" : "Sign in to AgriSense AI"}
            </p>
          </div>

          {/* Alert messages */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20
                            rounded-xl p-3.5 mb-5 text-sm text-red-400">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          {successMsg && (
            <div className="flex items-start gap-2.5 bg-emerald-500/10 border border-emerald-500/20
                            rounded-xl p-3.5 mb-5 text-sm text-emerald-400">
              <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? "Min. 6 characters" : "Your password"}
                  className="input-field pl-10 pr-10"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isSignup ? "Creating account…" : "Signing in…"}
                </span>
              ) : (
                isSignup ? "Create Account" : "Sign In"
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-slate-400 mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => { setIsSignup(!isSignup); setError(""); setSuccessMsg(""); }}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              {isSignup ? "Sign In" : "Sign Up Free"}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
