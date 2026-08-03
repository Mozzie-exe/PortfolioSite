import React, { useState } from 'react';
import { GameProject, GameBuild } from '../types';
import { 
  ArrowLeft, Download, Play, Heart, Star, Calendar, Cpu, Monitor, 
  CheckCircle, ShieldCheck, ChevronRight, X, ExternalLink, HardDrive, 
  Layers, MessageSquare, Send, Sparkles, Terminal, FileCode, Check 
} from 'lucide-react';

interface GameDetailPageProps {
  game: GameProject;
  onBack: () => void;
  onLikeGame: (gameId: string) => void;
  onAddReview: (gameId: string, author: string, rating: number, comment: string) => void;
  onRecordDownload: (gameId: string, buildId: string) => void;
}

export const GameDetailPage: React.FC<GameDetailPageProps> = ({
  game,
  onBack,
  onLikeGame,
  onAddReview,
  onRecordDownload
}) => {
  const [selectedScreenshot, setSelectedScreenshot] = useState<string>(
    game.screenshots && game.screenshots.length > 0 ? game.screenshots[0] : game.coverImage
  );

  React.useEffect(() => {
    if (game.screenshots && game.screenshots.length > 0) {
      setSelectedScreenshot(game.screenshots[0]);
    } else {
      setSelectedScreenshot(game.coverImage);
    }
  }, [game.id, game.screenshots, game.coverImage]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [downloadingBuildId, setDownloadingBuildId] = useState<string | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [hasLiked, setHasLiked] = useState(false);

  // Review form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const handleDownload = (build: GameBuild) => {
    setDownloadingBuildId(build.id);
    onRecordDownload(game.id, build.id);

    // Trigger file download via anchor click
    setTimeout(() => {
      setDownloadingBuildId(null);
      setDownloadSuccessMessage(`Downloading ${build.title} (${build.fileName}). Check your browser downloads!`);
      
      const link = document.createElement('a');
      link.href = build.fileUrl;
      link.download = build.fileName || `${game.title.replace(/\s+/g, '_')}_${build.platform}.zip`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => setDownloadSuccessMessage(null), 6000);
    }, 600);
  };

  const handleLike = () => {
    if (!hasLiked) {
      setHasLiked(true);
      onLikeGame(game.id);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;
    
    setReviewSubmitting(true);
    await onAddReview(game.id, reviewAuthor, reviewRating, reviewComment);
    setReviewSubmitting(false);
    setReviewAuthor('');
    setReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 transition-all flex items-center gap-2 text-xs font-mono tracking-wider uppercase shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-purple-400" />
          <span>Back to All Projects</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`px-4 py-2.5 rounded-xl border transition-all text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-sm ${
              hasLiked
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/40'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/10'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>{game.likesCount + (hasLiked ? 1 : 0)} Likes</span>
          </button>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/10 p-6 sm:p-10 mb-10 shadow-2xl backdrop-blur-md">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover filter blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-[#020204]/90 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold tracking-widest uppercase">
                {game.status}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-mono">
                {game.unityVersion}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-mono">
                {game.renderPipeline} Pipeline
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 ml-2 font-mono">
                <Calendar className="w-3.5 h-3.5 text-purple-400" /> Released {game.releaseDate}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-3 drop-shadow-md">
              {game.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              {game.tagline}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#020204]/80 p-4 rounded-xl border border-white/10 backdrop-blur-md">
            <div className="text-center px-3">
              <span className="block text-2xl font-black font-mono text-purple-400">{game.downloadsCount.toLocaleString()}</span>
              <span className="text-[9px] uppercase tracking-widest font-mono text-slate-400">Downloads</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="text-center px-3">
              <span className="block text-2xl font-black font-mono text-amber-400">
                {game.reviews && game.reviews.length > 0
                  ? (game.reviews.reduce((a, b) => a + b.rating, 0) / game.reviews.length).toFixed(1)
                  : '5.0'} ★
              </span>
              <span className="text-[9px] uppercase tracking-widest font-mono text-slate-400">{game.reviews?.length || 1} Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Media Gallery & Downloads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Left Column (2 Cols): Trailer & Screenshots Gallery */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Gameplay Trailer Section */}
          {game.trailerUrl && (
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden p-5 shadow-xl backdrop-blur-md">
              <h2 className="text-xs font-mono uppercase tracking-widest text-white mb-3 flex items-center gap-2">
                <Play className="w-4 h-4 text-purple-400 fill-purple-400" />
                Embedded Gameplay Trailer
              </h2>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10">
                <iframe
                  src={game.trailerUrl}
                  title={`${game.title} Trailer`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Screenshot Lightbox Gallery */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-mono uppercase tracking-widest text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                In-Game Screenshot Gallery
              </h2>
              <span className="text-[11px] font-mono text-slate-400">Click any image to enlarge</span>
            </div>

            {/* Main Active Screenshot */}
            <div 
              onClick={() => setLightboxOpen(true)}
              className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 cursor-pointer group mb-4 shadow-inner"
            >
              <img
                src={selectedScreenshot}
                alt={`${game.title} screenshot`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-[#020204]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-4 py-2 rounded-xl bg-[#020204]/90 text-purple-300 font-mono text-xs border border-purple-500/40">
                  🔍 View Fullscreen
                </span>
              </div>
            </div>

            {/* Thumbnails Row */}
            <div className="grid grid-cols-4 gap-3">
              {(game.screenshots || []).map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedScreenshot(imgUrl)}
                  className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedScreenshot === imgUrl
                      ? 'border-purple-400 ring-2 ring-purple-500/30 opacity-100'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Deep Overview & Tech Architecture */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <h2 className="text-xs font-mono uppercase tracking-widest text-white mb-4 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-purple-400" />
              Project Overview & Architecture
            </h2>
            
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-light mb-6">
              {game.detailedOverview}
            </div>

            {/* Technical Highlights Bullets */}
            {game.technicalHighlights && game.technicalHighlights.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-purple-400 mb-3 flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Unity Engineering Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {game.technicalHighlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#020204] p-3 rounded-xl border border-white/10 text-xs font-mono text-slate-200">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1 Col): Download Center & System Requirements */}
        <div className="space-y-8">
          
          {/* DOWNLOAD CENTER */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <h2 className="text-sm font-mono uppercase tracking-widest font-extrabold text-white mb-1 flex items-center gap-2">
              <Download className="w-5 h-5 text-purple-400" />
              Download Center
            </h2>
            <p className="text-xs text-slate-400 mb-6 font-light">
              Select your platform build file to begin immediate download.
            </p>

            {/* Notification alert */}
            {downloadSuccessMessage && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{downloadSuccessMessage}</span>
              </div>
            )}

            {/* Build Cards List */}
            <div className="space-y-3">
              {game.builds && game.builds.length > 0 ? (
                game.builds.map((build) => (
                  <div
                    key={build.id}
                    className="p-4 rounded-xl bg-[#020204] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono uppercase font-bold text-white group-hover:text-purple-400 transition-colors">
                          {build.title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-purple-500/10 text-purple-300 border border-purple-500/30">
                          {build.platform}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <span>{build.fileName}</span>
                        <span>•</span>
                        <span className="text-purple-300 font-bold">{build.fileSize}</span>
                        <span>•</span>
                        <span>v{build.version}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(build)}
                      disabled={downloadingBuildId === build.id}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {downloadingBuildId === build.id ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Preparing Download...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-slate-950" />
                          <span>Download Build File</span>
                        </>
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-[#020204] border border-white/10 text-center text-xs text-slate-400 font-mono">
                  No build files currently uploaded for this project.
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Safe & Virus-Scanned
              </span>
              <span>Unity LTS Compiled</span>
            </div>
          </div>

          {/* System Requirements Table */}
          {game.minRequirements && (
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
              <h2 className="text-xs font-mono uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-purple-400" />
                System Requirements
              </h2>
              
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span className="text-slate-400">OS</span>
                  <span className="text-slate-200 text-right">{game.minRequirements.os}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span className="text-slate-400">Processor</span>
                  <span className="text-slate-200 text-right">{game.minRequirements.processor}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span className="text-slate-400">Memory</span>
                  <span className="text-slate-200 text-right">{game.minRequirements.memory}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span className="text-slate-400">Graphics</span>
                  <span className="text-slate-200 text-right">{game.minRequirements.graphics}</span>
                </div>
                {game.minRequirements.directX && (
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-slate-400">DirectX</span>
                    <span className="text-slate-200 text-right">{game.minRequirements.directX}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Storage Space</span>
                  <span className="text-slate-200 text-right">{game.minRequirements.storage}</span>
                </div>
              </div>
            </div>
          )}

          {/* Devlogs & Patch Notes */}
          {game.devlogs && game.devlogs.length > 0 && (
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
              <h2 className="text-xs font-mono uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Devlog & Update History
              </h2>

              <div className="space-y-4">
                {game.devlogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-[#020204] border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">{log.title}</span>
                      <span className="text-[10px] text-purple-400 font-mono font-semibold">v{log.version}</span>
                    </div>
                    <span className="block text-[10px] font-mono text-slate-400 mb-2">{log.date}</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-light mb-2">{log.content}</p>
                    {log.changes && (
                      <ul className="list-disc list-inside text-[11px] font-mono text-slate-400 space-y-0.5">
                        {log.changes.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Community Reviews & Feedback Section */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl mb-12 backdrop-blur-md">
        <h2 className="text-xs font-mono uppercase tracking-widest text-white mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          Player & Reviewer Feedback
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Submit Review Form */}
          <form onSubmit={handleReviewSubmit} className="bg-[#020204] p-5 rounded-xl border border-white/10 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-white">Leave a Review</h3>
            
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Your Name / Gaming Tag</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex (Unity Developer)"
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Star Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-amber-400 cursor-pointer"
                  >
                    <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-700'}`} />
                  </button>
                ))}
                <span className="text-xs text-slate-400 font-mono font-bold ml-2">{reviewRating} / 5</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Comment / Feedback</label>
              <textarea
                required
                rows={3}
                placeholder="Share your experience playing this build..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={reviewSubmitting}
              className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Review</span>
            </button>
          </form>

          {/* Existing Reviews List */}
          <div className="lg:col-span-2 space-y-3">
            {game.reviews && game.reviews.length > 0 ? (
              game.reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl bg-[#020204] border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono text-white">{rev.author}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[10px] font-mono text-slate-500 ml-2">{rev.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">{rev.comment}</p>
                </div>
              ))
            ) : (
              <div className="p-6 rounded-xl bg-[#020204] border border-white/10 text-center text-xs font-mono text-slate-400">
                Be the first player to submit feedback for this Unity project build!
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Lightbox Modal for Screenshots */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020204]/95 backdrop-blur-xl animate-fadeIn">
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-10 right-0 p-2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedScreenshot}
              alt="Fullscreen screenshot"
              className="w-full max-h-[80vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};
