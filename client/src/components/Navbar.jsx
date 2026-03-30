import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Leaf, LayoutDashboard, History, LogOut, Menu, X, Sprout } from "lucide-react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navLinks = user
    ? [
        { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
        { to: "/history",   label: "History",   icon: <History size={16} /> },
      ]
    : [];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center
                            group-hover:bg-emerald-500/30 transition-colors">
              <Sprout size={18} className="text-emerald-400" />
            </div>
            <span className="font-bold text-lg text-white">
              AgriSense <span className="text-emerald-400">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive(link.to)
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-3 ml-3 pl-3 border-l border-slate-700">
                <span className="text-sm text-slate-400 hidden lg:block truncate max-w-[160px]">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-400
                             hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-3">
                <Link to="/auth" className="btn-secondary text-sm px-4 py-2">Sign in</Link>
                <Link to="/auth?signup=true" className="btn-primary text-sm px-4 py-2">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium w-full
                ${isActive(link.to)
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-slate-300 hover:bg-slate-800"}`}
            >
              {link.icon}{link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm text-red-400
                         hover:bg-red-500/10 transition-all"
            >
              <LogOut size={15} /> Sign out
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="btn-secondary text-sm text-center">Sign in</Link>
              <Link to="/auth?signup=true" onClick={() => setMobileOpen(false)} className="btn-primary text-sm text-center">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
