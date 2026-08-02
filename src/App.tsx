import React, { useState, useEffect, useMemo } from 'react';
import { GameProject, FilterState, ReviewItem } from './types';
import { INITIAL_GAMES } from './data/initialGames';
import { Header } from './components/Header';
import { HeroFeatured } from './components/HeroFeatured';
import { FilterBar } from './components/FilterBar';
import { GameCard } from './components/GameCard';
import { GameDetailPage } from './components/GameDetailPage';
import { AdminCMSModal } from './components/AdminCMSModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AboutDevModal } from './components/AboutDevModal';
import { Gamepad2, Layers, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import {
  subscribeGames,
  saveGameToFirestore,
  deleteGameFromFirestore,
  addReviewToFirestore,
  incrementLikesInFirestore,
  incrementDownloadsInFirestore
} from './lib/firebase';

export default function App() {
  const [games, setGames] = useState<GameProject[]>(() => {
    const local = localStorage.getItem('mozzie_portfolio_games');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.warn('Failed to parse local games storage');
      }
    }
    return INITIAL_GAMES;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync games to localStorage whenever games state changes as a fast cache fallback
  useEffect(() => {
    localStorage.setItem('mozzie_portfolio_games', JSON.stringify(games));
  }, [games]);

  // Realtime Firestore Subscription for global persistence across all IPs & devices
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeGames(
      (firestoreGames) => {
        setGames(firestoreGames);
        setLoading(false);
      },
      (err) => {
        console.warn('Firestore subscription failed, using local/cached state:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Active Selected Game for Detail View
  const [selectedGame, setSelectedGame] = useState<GameProject | null>(null);

  // Keep selectedGame synchronized with updated games list
  useEffect(() => {
    if (selectedGame) {
      const updated = games.find((g) => g.id === selectedGame.id);
      if (updated) setSelectedGame(updated);
    }
  }, [games]);

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('mozzie_admin_logged_in') === 'true';
  });
  const [adminToken, setAdminToken] = useState<string>(() => {
    return localStorage.getItem('mozzie_admin_token') || '!X030507akg';
  });

  // Modal toggles
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleSuccessAdminLogin = (token: string) => {
    setIsAdminLoggedIn(true);
    setAdminToken(token);
    localStorage.setItem('mozzie_admin_logged_in', 'true');
    localStorage.setItem('mozzie_admin_token', token);
    setAdminLoginOpen(false);
    setAdminOpen(true);
  };

  const handleLogoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('mozzie_admin_logged_in');
    setAdminOpen(false);
  };

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedGenre: 'ALL',
    selectedPlatform: 'ALL',
    selectedUnityVersion: 'ALL',
    selectedStatus: 'ALL',
    sortBy: 'featured'
  });

  // Save game project to Firestore & Express API
  const handleSaveGame = async (gameToSave: GameProject, isNew: boolean) => {
    // Save directly to Firestore for global cross-device synchronization
    try {
      await saveGameToFirestore(gameToSave);
    } catch (err) {
      console.error('Firestore save error:', err);
    }

    // Local optimistic update
    setGames((prev) => {
      if (isNew) return [gameToSave, ...prev];
      return prev.map((g) => (g.id === gameToSave.id ? gameToSave : g));
    });

    if (selectedGame && selectedGame.id === gameToSave.id) {
      setSelectedGame(gameToSave);
    }

    // Try Express backend if running
    try {
      const url = isNew ? '/api/games' : `/api/games/${gameToSave.id}`;
      const method = isNew ? 'POST' : 'PUT';

      await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify(gameToSave)
      });
    } catch (err: any) {
      console.warn('Backend save API unavailable, saved to Firestore & browser storage:', err);
    }
  };

  // Delete game in Firestore & API
  const handleDeleteGame = async (gameId: string) => {
    try {
      await deleteGameFromFirestore(gameId);
    } catch (err) {
      console.error('Firestore delete error:', err);
    }

    setGames((prev) => prev.filter((g) => g.id !== gameId));
    if (selectedGame?.id === gameId) {
      setSelectedGame(null);
    }

    try {
      await fetch(`/api/games/${gameId}`, { 
        method: 'DELETE',
        headers: {
          'x-admin-key': adminToken
        }
      });
    } catch (err: any) {
      console.warn('Backend delete API unavailable, deleted from Firestore & browser storage:', err);
    }
  };

  // Like game in Firestore & API
  const handleLikeGame = async (gameId: string) => {
    try {
      await incrementLikesInFirestore(gameId);
    } catch (err) {
      console.error('Firestore like error:', err);
    }

    try {
      await fetch(`/api/games/${gameId}/like`, { method: 'POST' });
    } catch (err) {
      console.warn('Backend like endpoint unavailable:', err);
    }

    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, likesCount: g.likesCount + 1 } : g))
    );
    if (selectedGame && selectedGame.id === gameId) {
      setSelectedGame((prev) => (prev ? { ...prev, likesCount: prev.likesCount + 1 } : null));
    }
  };

  // Record Download event in Firestore & API
  const handleRecordDownload = async (gameId: string, buildId: string) => {
    try {
      await incrementDownloadsInFirestore(gameId);
    } catch (err) {
      console.error('Firestore download count increment error:', err);
    }

    try {
      await fetch(`/api/games/${gameId}/download/${buildId}`, { method: 'POST' });
    } catch (err) {
      console.warn('Backend download endpoint unavailable:', err);
    }

    setGames((prev) =>
      prev.map((g) =>
        g.id === gameId
          ? {
              ...g,
              downloadsCount: g.downloadsCount + 1,
              builds: g.builds.map((b) =>
                b.id === buildId ? { ...b, downloadCount: b.downloadCount + 1 } : b
              )
            }
          : g
      )
    );
    if (selectedGame && selectedGame.id === gameId) {
      setSelectedGame((prev) =>
        prev
          ? {
              ...prev,
              downloadsCount: prev.downloadsCount + 1,
              builds: prev.builds.map((b) =>
                b.id === buildId ? { ...b, downloadCount: b.downloadCount + 1 } : b
              )
            }
          : null
      );
    }
  };

  // Add Community Review in Firestore & API
  const handleAddReview = async (gameId: string, author: string, rating: number, comment: string) => {
    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      author,
      rating,
      date: new Date().toISOString().split('T')[0],
      comment
    };

    try {
      await addReviewToFirestore(gameId, newReview);
    } catch (err) {
      console.error('Firestore review error:', err);
    }

    try {
      await fetch(`/api/games/${gameId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, rating, comment })
      });
    } catch (err) {
      console.warn('Backend review API unavailable:', err);
    }

    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, reviews: [newReview, ...(g.reviews || [])] } : g))
    );
    if (selectedGame && selectedGame.id === gameId) {
      setSelectedGame((prev) =>
        prev ? { ...prev, reviews: [newReview, ...(prev.reviews || [])] } : null
      );
    }
  };

  // Available unique genres for filtering
  const availableGenres = useMemo(() => {
    const genreSet = new Set<string>();
    games.forEach((g) => g.genre?.forEach((gn) => genreSet.add(gn)));
    return Array.from(genreSet);
  }, [games]);

  // Spotlight featured project
  const featuredGame = useMemo(() => {
    return games.find((g) => g.featured) || games[0];
  }, [games]);

  // Filtered & Sorted Games List
  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        // Search query filter
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const matchTitle = game.title.toLowerCase().includes(q);
          const matchDesc = game.description.toLowerCase().includes(q);
          const matchUnity = game.unityVersion.toLowerCase().includes(q);
          const matchGenre = game.genre.some((g) => g.toLowerCase().includes(q));
          const matchHighlights = game.technicalHighlights?.some((h) => h.toLowerCase().includes(q));

          if (!matchTitle && !matchDesc && !matchUnity && !matchGenre && !matchHighlights) {
            return false;
          }
        }

        // Genre filter
        if (filters.selectedGenre !== 'ALL') {
          if (!game.genre.includes(filters.selectedGenre)) return false;
        }

        // Platform filter
        if (filters.selectedPlatform !== 'ALL') {
          const hasPlatform = game.builds?.some((b) => b.platform === filters.selectedPlatform);
          if (!hasPlatform) return false;
        }

        // Status filter
        if (filters.selectedStatus !== 'ALL') {
          if (game.status !== filters.selectedStatus) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'featured') {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        }
        if (filters.sortBy === 'newest') {
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        }
        if (filters.sortBy === 'downloads') {
          return b.downloadsCount - a.downloadsCount;
        }
        if (filters.sortBy === 'rating') {
          const avgA = a.reviews?.length ? a.reviews.reduce((acc, r) => acc + r.rating, 0) / a.reviews.length : 5;
          const avgB = b.reviews?.length ? b.reviews.reduce((acc, r) => acc + r.rating, 0) / b.reviews.length : 5;
          return avgB - avgA;
        }
        return 0;
      });
  }, [games, filters]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Header */}
      <Header
        onOpenAdmin={() => {
          if (isAdminLoggedIn) {
            setAdminOpen(true);
          } else {
            setAdminLoginOpen(true);
          }
        }}
        onOpenAbout={() => setAboutOpen(true)}
        activeTab={selectedGame ? 'detail' : 'showcase'}
        onNavigateHome={() => setSelectedGame(null)}
        gamesCount={games.length}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogoutAdmin={handleLogoutAdmin}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {selectedGame ? (
          /* Detailed Game View */
          <GameDetailPage
            game={selectedGame}
            onBack={() => setSelectedGame(null)}
            onLikeGame={handleLikeGame}
            onAddReview={handleAddReview}
            onRecordDownload={handleRecordDownload}
          />
        ) : (
          /* Main Showcase Hub */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            
            {/* Featured Spotlight Hero */}
            {featuredGame && (
              <HeroFeatured
                game={featuredGame}
                onSelectGame={(g) => setSelectedGame(g)}
              />
            )}

            {/* Filter Bar */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Projects Vault
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                Showing {filteredGames.length} of {games.length} Games
              </span>
            </div>

            <FilterBar
              filters={filters}
              onFilterChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
              onReset={() =>
                setFilters({
                  searchQuery: '',
                  selectedGenre: 'ALL',
                  selectedPlatform: 'ALL',
                  selectedUnityVersion: 'ALL',
                  selectedStatus: 'ALL',
                  sortBy: 'featured'
                })
              }
              availableGenres={availableGenres}
            />

            {/* Games Cards Grid */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onSelectGame={(g) => setSelectedGame(g)}
                  />
                ))}
              </div>
            ) : games.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 my-8">
                <Gamepad2 className="w-12 h-12 text-cyan-500/50 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No Projects Published Yet</h3>
                <p className="text-xs text-slate-400 mb-4">Use the Admin CMS panel to add your Unity projects, screenshots, builds, and devlogs.</p>
                <button
                  onClick={() => {
                    if (isAdminLoggedIn) {
                      setAdminOpen(true);
                    } else {
                      setAdminLoginOpen(true);
                    }
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
                >
                  Open Admin CMS
                </button>
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 my-8">
                <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No Unity Projects Match Your Filters</h3>
                <p className="text-xs text-slate-400 mb-4">Try clearing your search query or adjusting genre/platform filters.</p>
                <button
                  onClick={() =>
                    setFilters({
                      searchQuery: '',
                      selectedGenre: 'ALL',
                      selectedPlatform: 'ALL',
                      selectedUnityVersion: 'ALL',
                      selectedStatus: 'ALL',
                      sortBy: 'featured'
                    })
                  }
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-xs font-bold transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <span>Mozzie • Kerem Guvenli Game Development Studio</span>
          </div>
          <p>© {new Date().getFullYear()} Mozzie (Kerem Guvenli). All rights reserved.</p>
        </div>
      </footer>

      {/* Studio CMS Admin Modal */}
      {adminOpen && (
        <AdminCMSModal
          games={games}
          adminToken={adminToken}
          onClose={() => setAdminOpen(false)}
          onSaveGame={handleSaveGame}
          onDeleteGame={handleDeleteGame}
        />
      )}

      {/* Admin Login Authentication Modal */}
      {adminLoginOpen && (
        <AdminLoginModal
          onClose={() => setAdminLoginOpen(false)}
          onSuccessLogin={handleSuccessAdminLogin}
        />
      )}

      {/* Developer Specs Modal */}
      {aboutOpen && (
        <AboutDevModal
          onClose={() => setAboutOpen(false)}
        />
      )}

    </div>
  );
}
