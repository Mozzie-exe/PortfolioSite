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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Logo / Brand */}
        <button 
          onClick={onNavigateHome} 
          className="flex items-center gap-2.5 sm:gap-4 group text-left focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-xl p-1 min-w-0"
        >
          {/* Rotated Diamond Logo Icon */}
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-sm rotate-45 shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform duration-300 shrink-0">
            <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 -rotate-45" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-300"></span>
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-xl tracking-wider uppercase text-slate-100 group-hover:text-purple-400 transition-colors truncate">
                MOZZIE<span className="text-purple-400">.STUDIO</span>
              </span>
              <span className="hidden lg:inline-block px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-md shrink-0">
                UNITY 6 / URP / HDRP
              </span>
            </div>
            <p className="text-[10px] sm:text-[12px] font-semibold text-slate-300 tracking-wider uppercase truncate">
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
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Developer Bio Trigger */}
          <button
            onClick={onOpenAbout}
            className="px-2.5 py-2 sm:px-3.5 sm:py-2.5 text-[10px] sm:text-[11px] uppercase tracking-widest font-bold rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 hover:border-purple-500/30 transition-all flex items-center gap-1.5 sm:gap-2 shadow-sm"
          >
            <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
            <span className="hidden xs:inline">Dev Specs</span>
          </button>

          {/* Admin Mode Badge & Controls */}
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={onOpenAdmin}
                className="px-2.5 py-2 sm:px-3.5 sm:py-2.5 text-[10px] sm:text-[11px] uppercase tracking-widest font-extrabold rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-slate-950 shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_25px_rgba(168,85,247,0.55)] transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer active:scale-95"
                title="Open Admin CMS Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950" />
                <span>CMS</span>
              </button>

              <button
                onClick={onLogoutAdmin}
                className="p-2 sm:p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all cursor-pointer flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-bold"
                title="Lock Admin Session"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdmin}
              className="px-2.5 py-2 sm:px-3.5 sm:py-2.5 text-[10px] sm:text-[11px] uppercase tracking-widest font-bold rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
              <span className="hidden xs:inline">Admin</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};

