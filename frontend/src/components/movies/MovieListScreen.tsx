import React, { useState, useEffect } from 'react';
import { Search, Flame, Sparkles, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { Genre, Movie } from '../../types';
import { movieService } from '../../services/movieService';
import { MovieCard } from './MovieCard';

interface Props {
  onSelectMovie: (movie: Movie) => void;
}

const GENRES: (Genre | 'Tümü')[] = [
  'Tümü',
  'Bilim Kurgu',
  'Aksiyon',
  'Macera',
  'Dram',
  'Komedi',
  'Animasyon',
  'Gerilim',
];

export const MovieListScreen: React.FC<Props> = ({ onSelectMovie }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'Tümü'>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'showing' | 'upcoming'>('showing');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [allMovies, featured] = await Promise.all([
        movieService.getMovies(selectedGenre, searchQuery),
        movieService.getFeaturedMovies(),
      ]);
      setMovies(allMovies);
      setFeaturedMovies(featured);
    } catch (err: any) {
      setError('Film verileri yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedGenre, searchQuery]);

  const displayedMovies = movies.filter((m) => {
    if (activeTab === 'showing') return m.isNowShowing !== false;
    return m.isUpcoming === true;
  });

  return (
    <div className="flex-1 overflow-y-auto pb-20 bg-slate-950 text-slate-100 scrollbar-thin">
      {/* Search Bar */}
      <div className="p-4 sticky top-0 bg-slate-950/90 backdrop-blur-md z-20 border-b border-slate-900">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Film, yönetmen veya tür ara..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
            >
              Temizle
            </button>
          )}
        </div>

        {/* Genre Chips Slider */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mt-3 pt-1">
          {GENRES.map((genre) => {
            const isSelected = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Banner Carousel (Only if search is empty and genre is Tümü) */}
      {!searchQuery && selectedGenre === 'Tümü' && featuredMovies.length > 0 && (
        <section className="mt-2 mb-6">
          <div className="px-4 mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-red-500" />
              Öne Çıkan Filmler
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Trendler</span>
          </div>

          <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar pb-2">
            {featuredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={onSelectMovie}
                variant="carousel"
              />
            ))}
          </div>
        </section>
      )}

      {/* Showing / Upcoming Tabs */}
      <section className="px-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('showing')}
              className={`text-sm font-bold transition-colors relative pb-1 ${
                activeTab === 'showing' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Vizyondakiler ({movies.filter((m) => m.isNowShowing !== false).length})
              {activeTab === 'showing' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`text-sm font-bold transition-colors relative pb-1 ${
                activeTab === 'upcoming' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Pek Yakında ({movies.filter((m) => m.isUpcoming).length})
              {activeTab === 'upcoming' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
            </button>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            title="Yenile"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-red-500' : ''}`} />
          </button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-red-500" />
            <p className="text-xs font-medium">Spring Boot REST API&apos;den yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-rose-300 text-xs text-center my-6">
            <AlertCircle className="w-5 h-5 text-rose-400 mx-auto mb-2" />
            <p>{error}</p>
            <button
              onClick={loadData}
              className="mt-3 px-3 py-1.5 bg-rose-900 hover:bg-rose-800 text-white rounded-xl font-bold"
            >
              Tekrar Dene
            </button>
          </div>
        ) : displayedMovies.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <p className="text-xs">Aramanıza uygun film bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {displayedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={onSelectMovie}
                variant="grid"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
