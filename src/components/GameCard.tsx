import React from 'react';
import { GameProject, PlatformType } from '../types';
import { Download, Star, Cpu, Monitor, Play, ShieldAlert, ArrowRight } from 'lucide-react';

interface GameCardProps {
  game: GameProject;
  onSelectGame: (game: GameProject) => void;
}

const getPlatformIcon = (platform: PlatformType) => {
  switch (platform) {
    case 'windows': return '🪟 Win';
    case 'mac': return '🍏 Mac';
    case 'linux': return '🐧 Linux';
    case 'webgl': return '🌐 WebGL';
    case 'android': return '🤖 Android';
    case 'ios': return '📱 iOS';
    default: return platform;
  }
};

export const GameCard: React.FC<GameCardProps> = ({ game, onSelectGame }) => {
  const averageRating = game.reviews && game.reviews.length > 0
    ? (game.reviews.reduce((acc, r) => acc + r.rating, 0) / game.reviews.length).toFixed(1)
    : '4.9';

  return (
    <div 
      onClick={() => onSelectGame(game)}
      className="group relative bg-white/[0.02] border border-white/10 hover:border-purple-500/40 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1 backdrop-blur-md"
    >
      {/* Thumbnail Header */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/60">
        <img
          src={game.coverImage}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-[#020204]/20 to-transparent opacity-90" />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase border backdrop-blur-md shadow-md ${
            game.status === 'Released' 
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : game.status === 'Playable Demo'
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
          }`}>
            {game.status}
          </span>
        </div>

        {/* Unity Render Pipeline Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-[#020204]/80 text-purple-300 border border-white/10 backdrop-blur-md">
            {game.renderPipeline}
          </span>
        </div>

        {/* Hover Action Teaser */}
        <div className="absolute inset-0 bg-[#020204]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="px-4 py-2 rounded-xl bg-purple-500 text-slate-950 font-extrabold text-[11px] tracking-wider uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.45)]">
            View Details & Builds <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          
          {/* Title & Unity Version */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider group-hover:text-purple-400 transition-colors line-clamp-1">
              {game.title}
            </h3>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed font-light">
            {game.description}
          </p>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {game.genre.map((g) => (
              <span key={g} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-[10px] font-mono text-slate-300">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Info: Platforms & Download Stats */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          
          {/* Platform Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {game.builds && game.builds.map((b) => (
              <span key={b.id} className="px-1.5 py-0.5 rounded-md bg-[#020204] border border-white/10 text-[10px] text-slate-300 font-mono">
                {getPlatformIcon(b.platform)}
              </span>
            ))}
          </div>

          {/* Downloads & Rating */}
          <div className="flex items-center gap-3 font-mono text-slate-300">
            <span className="flex items-center gap-1 text-amber-400 text-xs">
              <Star className="w-3 h-3 fill-amber-400" />
              {averageRating}
            </span>
            <span className="flex items-center gap-1 text-slate-300 text-xs">
              <Download className="w-3 h-3 text-purple-400" />
              {game.downloadsCount.toLocaleString()}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
