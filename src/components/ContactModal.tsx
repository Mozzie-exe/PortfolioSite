import React, { useState } from 'react';
import { Mail, MapPin, User, X, Copy, Check, Globe, MessageSquare } from 'lucide-react';

interface ContactModalProps {
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const email = 'akguvenli0@gmail.com';
  const name = 'Kerem Guvenli';
  const location = 'Istanbul, Turkey';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#020204]/90 backdrop-blur-xl animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#09090e] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-mono uppercase tracking-widest font-extrabold text-white">
                Contact Developer
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 font-light">
                Get in touch for collaborations & game projects
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 text-xs text-slate-300">
          
          {/* Developer Card Info */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-purple-500/[0.07] to-transparent border border-purple-500/20 space-y-3">
            
            {/* Name */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/[0.04] text-purple-400 border border-white/10 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-purple-300/80 font-bold">
                  Developer & Lead Architect
                </span>
                <span className="text-sm font-bold text-white tracking-wide">
                  {name} <span className="text-purple-400 text-xs font-mono">(Mozzie)</span>
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/[0.04] text-purple-400 border border-white/10 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-purple-300/80 font-bold">
                  Location & Country
                </span>
                <span className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  {location}
                </span>
              </div>
            </div>

            {/* Email Contact Box */}
            <div className="flex items-start gap-3 pt-1">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-purple-300/80 font-bold">
                  Direct Email Address
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-purple-200 break-all select-all">
                  {email}
                </span>
              </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-1">
            <button
              onClick={handleCopyEmail}
              className={`w-full py-2.5 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 text-xs font-mono font-bold cursor-pointer active:scale-95 ${
                copied
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 border-purple-500/30 hover:border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Email Address Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-purple-400" />
                  <span>Copy Email Address</span>
                </>
              )}
            </button>
          </div>

          {/* Note */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5 text-[11px] text-slate-400">
            <MessageSquare className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Feel free to reach out for game development commissions, technical consulting, Unity shader & systems design, or publishing inquiries.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
