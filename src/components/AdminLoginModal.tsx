import React, { useState } from 'react';
import { Lock, KeyRound, ShieldCheck, ShieldAlert, Eye, EyeOff, X, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  onClose: () => void;
  onSuccessLogin: (token: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onSuccessLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = password.trim();
    if (!entered) return;

    setLoading(true);
    setErrorMsg(null);

    let apiSuccess = false;
    let apiToken = entered;

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: entered })
      });

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok && data && data.success) {
          apiSuccess = true;
          apiToken = data.token || entered;
        } else if (data && data.error) {
          setErrorMsg(data.error);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend API verify unreachable or static deployment, using fallback check:', err);
    }

    if (apiSuccess) {
      onSuccessLogin(apiToken);
      setLoading(false);
      return;
    }

    // Client-side fallback check for static hosting (Vercel / GitHub Pages)
    const storedToken = localStorage.getItem('mozzie_admin_token');
    const validKeys = ['!X030507akg', 'mozzie2026'];
    if (storedToken) validKeys.push(storedToken);

    if (validKeys.includes(entered)) {
      onSuccessLogin(entered);
      setLoading(false);
      return;
    }

    setErrorMsg('Incorrect admin password. Please check your passcode and try again.');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020204]/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#020204] border border-purple-500/30 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.25)] overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500"></div>

        {/* Header */}
        <div className="p-6 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-mono uppercase tracking-widest font-extrabold text-white">Admin Authentication</h2>
              <p className="text-xs text-slate-400 font-light">Kerem Guvenli • Mozzie Studio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <p className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-purple-400" />
              Restricted Studio Management
            </p>
            Only <strong className="text-purple-300 font-mono">Kerem Guvenli (Admin)</strong> can upload game builds, add projects, or modify portfolio content. Clients have read-only & download access.
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-semibold">
              Admin Passcode / Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin passcode..."
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500 focus:bg-white/[0.08] text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-slate-950 font-mono text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Unlock Admin CMS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
