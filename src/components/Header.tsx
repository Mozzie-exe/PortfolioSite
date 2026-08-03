import React from 'react';
import { Gamepad2, Layers, PlusCircle, UserCheck, Lock, ShieldCheck, LogOut } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  onOpenAbout: () => void;
  activeTab: 'showcase' | 'detail';
  onNavigateHome: () => void;
  gamesCount: number;
  isAdminLoggedIn: boolean;
  onLogoutAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  onOpenAbout,
  activeTab,
  onNavigateHome,
  gamesCount,
  isAdminLoggedIn,
  onLogoutAdmin
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#020204]/80 backdrop-blur-xl border-b border-white/10 transition-all shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Logo / Brand */}
        <button 
          onClick={onNavigateHome} 
          className="flex items-center gap-4 group text-left focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-xl p-1"
        >
          {/* Rotated Diamond Logo Icon */}
          <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-sm rotate-45 shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform duration-300">
            <Gamepad2 className="w-5 h-5 text-slate-950 -rotate-45" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-300"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-black text-xl tracking-wider uppercase text-slate-100 group-hover:text-purple-400 transition-colors">
                MOZZIE<span className="text-purple-400">.STUDIO</span>
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-md">
                UNITY 6 / URP / HDRP
              </span>
            </div>
            <p className="text-[12px] font-semibold text-slate-300 tracking-wider uppercase">
              Kerem Guvenli
            </p>
          </div>
        </button>

        {/* Center Nav Link / Status */}
        <div className="hidden md:flex items-center gap-4 text-xs tracking-wider uppercase font-semibold text-slate-300">
          <button
            onClick={onNavigateHome}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 border ${
              activeTab === 'showcase' 
                ? 'bg-purple-500/10 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.18)]' 
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white border-white/5'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Projects Vault ({gamesCount})</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Developer Bio Trigger */}
          <button
            onClick={onOpenAbout}
            className="px-3.5 py-2.5 text-[11px] uppercase tracking-widest font-bold rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 hover:border-purple-500/30 transition-all flex items-center gap-2 shadow-sm"
          >
            <UserCheck className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Developer Specs</span>
          </button>

          {/* Admin Mode Badge & Controls */}
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAdmin}
                className="px-3.5 py-2.5 text-[11px] uppercase tracking-widest font-extrabold rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-slate-950 shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_25px_rgba(168,85,247,0.55)] transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                title="Open Admin CMS Dashboard"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>Admin CMS</span>
              </button>

              <button
                onClick={onLogoutAdmin}
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-mono font-bold"
                title="Lock Admin Session"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Lock Admin</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-2.5 text-[11px] uppercase tracking-widest font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/30 hover:border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.18)] transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Login</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};

