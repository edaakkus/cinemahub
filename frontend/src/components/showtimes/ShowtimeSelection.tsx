import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, Film, ChevronRight, Filter, Sparkles } from 'lucide-react';
import { Movie, Showtime, ScreenFormat } from '../../types';
import { movieService } from '../../services/movieService';
import { showtimeService } from '../../services/showtimeService';

interface Props {
  onSelectShowtime: (showtime: Showtime, movie: Movie) => void;
}

export const ShowtimeSelection: React.FC<Props> = ({ onSelectShowtime }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [availableDates, setAvailableDates] = useState<
    { dayName: string; dayNumber: string; dateStr: string; isToday: boolean }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<ScreenFormat | 'Tümü'>('Tümü');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dates = showtimeService.getAvailableDates();
    setAvailableDates(dates);
    if (dates.length > 0) setSelectedDate(dates[0].dateStr);
  }, []);

  useEffect(() => {
    setLoading(true);
    movieService
      .getMovies()
      .then((res) => setMovies(res))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-slate-950 text-slate-100 scrollbar-thin p-4">
      <div className="mb-4">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-red-500" />
          Seans Takvimi
        </h2>
        <p className="text-xs text-slate-400">Vizyondaki filmlerin bugünkü ve gelecek seansları</p>
      </div>

      {/* Date Selector Slider */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
        {availableDates.map((d) => {
          const isSelected = selectedDate === d.dateStr;
          return (
            <button
              key={d.dateStr}
              onClick={() => setSelectedDate(d.dateStr)}
              className={`py-2 px-3.5 rounded-2xl shrink-0 flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <span className="text-[10px] font-semibold opacity-80">{d.dayName}</span>
              <span className="text-sm font-black">{d.dayNumber}</span>
            </button>
          );
        })}
      </div>

      {/* Format Filter */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto no-scrollbar">
        {(['Tümü', 'IMAX 3D', '2D', '3D', 'VIP Lounge', 'Dolby Atmos'] as const).map((fmt) => (
          <button
            key={fmt}
            onClick={() => setSelectedFormat(fmt)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedFormat === fmt
                ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>

      {/* Movies with Showtimes list */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Seans verileri yükleniyor...</div>
      ) : (
        <div className="space-y-4">
          {movies.map((movie) => (
            <ShowtimeMovieCard
              key={movie.id}
              movie={movie}
              date={selectedDate}
              formatFilter={selectedFormat}
              onSelectShowtime={onSelectShowtime}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Subcomponent for each movie's showtime row
const ShowtimeMovieCard: React.FC<{
  movie: Movie;
  date: string;
  formatFilter: string;
  onSelectShowtime: (showtime: Showtime, movie: Movie) => void;
}> = ({ movie, date, formatFilter, onSelectShowtime }) => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);

  useEffect(() => {
    showtimeService.getShowtimesByMovie(movie.id, date).then((res) => {
      let filtered = res;
      if (formatFilter !== 'Tümü') {
        filtered = res.filter((s) => s.format === formatFilter);
      }
      setShowtimes(filtered);
    });
  }, [movie.id, date, formatFilter]);

  if (showtimes.length === 0) return null;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex gap-3">
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-16 h-24 object-cover rounded-xl shrink-0 border border-slate-800"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm text-white truncate mb-1">{movie.title}</h3>
        <p className="text-[11px] text-slate-400 mb-2">
          {movie.durationMinutes} dk • {movie.genres.slice(0, 2).join(', ')}
        </p>

        {/* Time Chips */}
        <div className="flex flex-wrap gap-2">
          {showtimes.map((st) => (
            <button
              key={st.id}
              onClick={() => onSelectShowtime(st, movie)}
              className="px-2.5 py-1.5 bg-slate-950 hover:bg-red-600 hover:text-white text-slate-200 border border-slate-800 hover:border-red-500 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm group"
            >
              <span>{st.startTime}</span>
              <span className="text-[9px] px-1 py-0.2 bg-red-600/20 group-hover:bg-white/20 text-red-400 group-hover:text-white rounded">
                {st.format}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
