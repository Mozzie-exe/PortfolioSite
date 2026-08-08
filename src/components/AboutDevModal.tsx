import React from 'react';
import { X, Gamepad2, Cpu, Code2, Layers, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

interface AboutDevModalProps {
  onClose: () => void;
}

export const AboutDevModal: React.FC<AboutDevModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#020204]/95 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#020204] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white/[0.02] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-mono uppercase tracking-widest font-extrabold text-white">Mozzie — Kerem Guvenli</h2>
              <p className="text-[10px] sm:text-xs text-slate-400 font-light">Lead Game Architect & Systems Engineer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 text-xs text-slate-300 overflow-y-auto">
          
          {/* Bio Summary */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/10 font-light">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Professional Summary
            </h3>
            <p className="leading-relaxed text-slate-300">
              Experienced Unity Game Developer specializing in real-time 3D physics engines, HLSL custom shaders, High-Definition Render Pipeline (HDRP/URP), and low-level C# performance optimization using Unity DOTS, Burst Compiler, and Job Systems.
            </p>
          </div>

          {/* Tech Matrix */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-purple-400 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Technical Proficiency & Tooling
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              {[
                { title: 'Unity Engine 6 & 2022 LTS', desc: 'HDRP, URP, Custom Render Pipelines' },
                { title: 'C# / Native C++ Plugins', desc: 'Burst Compiler, SIMD Jobs System' },
                { title: 'Graphics & Shader Graph', desc: 'HLSL, Dynamic Volumetric Lighting, Raytracing' },
                { title: 'Physics & DOTS/ECS', desc: 'PhysX 5, Custom Kinematic Rigidbodies' },
                { title: 'Audio & Middleware', desc: 'FMOD Studio, Spatialized 3D Soundscapes' },
                { title: '3D Pipeline & Art', desc: 'Blender, Substance Painter, Texture Baking' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#020204] border border-white/10 font-mono">
                  <span className="font-bold text-white block mb-0.5 text-xs">{item.title}</span>
                  <span className="text-[10px] text-slate-400 block font-light">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-slate-400 text-[11px] font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Windows, macOS, Linux & WebGL Targets
            </span>
            <span className="text-purple-400 font-bold">kerem@mozzie.studio</span>
          </div>

        </div>

      </div>
    </div>
  );
};
