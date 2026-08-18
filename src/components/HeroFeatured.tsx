import React, { useState } from 'react';
import { GameProject } from '../types';
import { Play, Download, Sparkles, Monitor, Cpu, Heart, ExternalLink, X } from 'lucide-react';

interface HeroFeaturedProps {
  game: GameProject;
  onSelectGame: (game: GameProject) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({ game, onSelectGame }) => {
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  const totalBuilds = game.builds?.length || 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] mb-10 backdrop-blur-md">
      
      {/* Background Cover Image with Gradient Mask */}
      <div className="absolute inset-0 z-0">
        <img
          src={game.coverImage}
          alt={game.title}
          className="w-full h-full object-cover object-center opacity-25 transform scale-105 filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-[#020204]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020204] via-[#020204]/90 to-transparent" />
      </div>

      <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-4xl">
        
        {/* Featured Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono tracking-widest uppercase mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>SPOTLIGHT FEATURED PROJECT</span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        </div>

        {/* Title & Tagline */}
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-3 drop-shadow-lg">
          {game.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl mb-6">
          {game.tagline}
        </p>

        {/* Engine Badges & Specs */}
        <div className="flex flex-wrap items-center gap-3 mb-8 text-xs font-mono text-slate-300">
          <span className="px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-purple-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            {game.unityVersion}
          </span>
          <span className="px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-indigo-300 flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-indigo-400" />
            {game.renderPipeline}
          </span>
          <span className="px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            {game.status}
          </span>
          <span className="px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-rose-300 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            {game.likesCount} Likes
          </span>
          <span className="px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-slate-300">
            {game.downloadsCount.toLocaleString()} Downloads
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => onSelectGame(game)}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_25px_rgba(168,85,247,0.55)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>View Details & Download Builds ({totalBuilds})</span>
          </button>

          {game.trailerUrl && (
            <button
              onClick={() => setShowTrailerModal(true)}
              className="px-5 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold text-xs uppercase tracking-wider border border-white/10 hover:border-purple-500/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-purple-400 fill-purple-400" />
              <span>Watch Gameplay Trailer</span>
            </button>
          )}
        </div>

      </div>

      {/* Trailer Video Modal */}
      {showTrailerModal && game.trailerUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020204]/95 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-[#020204] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-200 flex items-center gap-2">
                <Play className="w-4 h-4 text-purple-400 fill-purple-400" />
                {game.title} - Official Gameplay Trailer
              </h3>
              <button
                onClick={() => setShowTrailerModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={game.trailerUrl}
                title={`${game.title} Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
