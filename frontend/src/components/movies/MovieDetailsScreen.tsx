import React, { useState, useEffect } from 'react';
import { Star, Clock, Calendar, Play, ChevronRight, Share2, Heart, ArrowLeft, Users, Shield } from 'lucide-react';
import { Movie, Showtime } from '../../types';
import { showtimeService } from '../../services/showtimeService';

interface Props {
  movie: Movie;
  onBack: () => void;
  onSelectShowtime: (showtime: Showtime) => void;
}

export const MovieDetailsScreen: React.FC<Props> = ({ movie, onBack, onSelectShowtime }) => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<
    { dayName: string; dayNumber: string; dateStr: string; isToday: boolean }[]
  >([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);

  useEffect(() => {
    const dates = showtimeService.getAvailableDates();
    setAvailableDates(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[0].dateStr);
    }
  }, []);

  useEffect(() => {
    if (selectedDate && movie.id) {
      setLoadingShowtimes(true);
      showtimeService
        .getShowtimesByMovie(movie.id, selectedDate)
        .then((res) => setShowtimes(res))
        .catch(() => setShowtimes([]))
        .finally(() => setLoadingShowtimes(false));
    }
  }, [movie.id, selectedDate]);

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-slate-950 text-slate-100 scrollbar-thin">
      {/* Backdrop Image Banner Header */}
      <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Floating Actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={onBack}
            className="p-2.5 bg-slate-950/80 backdrop-blur-md text-white rounded-2xl hover:bg-slate-900 border border-slate-800 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="p-2.5 bg-slate-950/80 backdrop-blur-md text-white rounded-2xl hover:bg-slate-900 border border-slate-800 shadow-lg"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
            <button className="p-2.5 bg-slate-950/80 backdrop-blur-md text-white rounded-2xl hover:bg-slate-900 border border-slate-800 shadow-lg">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Play Trailer Button */}
        <button
          onClick={() => setIsPlayingTrailer(true)}
          className="absolute inset-0 m-auto w-14 h-14 bg-red-600/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50 hover:scale-110 transition-all border-2 border-white/20"
        >
          <Play className="w-6 h-6 fill-white ml-0.5" />
        </button>
      </div>

      {/* Movie Main Metadata Info Block */}
      <div className="px-5 -mt-16 relative z-10 flex gap-4 items-end">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-28 h-40 object-cover rounded-2xl shadow-2xl border-2 border-slate-800 shrink-0"
        />

        <div className="flex-1 pb-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 font-bold text-xs rounded-md border border-amber-500/30 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> {movie.rating.toFixed(1)}
            </span>
            <span className="px-2 py-0.5 bg-slate-900 text-slate-300 font-bold text-xs rounded-md border border-slate-800">
              {movie.ageRating}
            </span>
          </div>

          <h1 className="text-xl font-extrabold text-white leading-tight">{movie.title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{movie.originalTitle || movie.director}</p>
        </div>
      </div>

      {/* Meta Bar */}
      <div className="px-5 my-4 flex items-center justify-between text-xs text-slate-300 bg-slate-900/60 p-3 rounded-2xl mx-5 border border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-red-500" />
          <span>{movie.durationMinutes} dakika</span>
        </div>
        <span>•</span>
        <div className="truncate max-w-[150px]">{movie.genres.join(', ')}</div>
        <span>•</span>
        <div className="text-red-400 font-semibold">{movie.language}</div>
      </div>

      {/* Synopsis */}
      <div className="px-5 mb-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Özet & Hikaye
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3.5 rounded-2xl border border-slate-800/40">
          {movie.synopsis}
        </p>
      </div>

      {/* Cast list */}
      {movie.cast && movie.cast.length > 0 && (
        <div className="mb-6">
          <div className="px-5 mb-2.5 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-red-500" />
              Oyuncular & Yönetmen
            </h3>
          </div>

          <div className="flex gap-3 overflow-x-auto px-5 no-scrollbar">
            {movie.cast.map((actor, idx) => (
              <div
                key={idx}
                className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 min-w-[120px] shrink-0 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-bold text-xs mx-auto flex items-center justify-center mb-1.5 border border-slate-700">
                  {actor.name.charAt(0)}
                </div>
                <p className="text-xs font-bold text-white truncate">{actor.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{actor.roleName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Showtime Selection Section */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-red-500" />
            Tarih & Seans Seçimi
          </h3>
        </div>

        {/* Date Selector */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
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

        {/* Showtimes List */}
        {loadingShowtimes ? (
          <div className="py-6 text-center text-xs text-slate-500">Seanslar yükleniyor...</div>
        ) : showtimes.length === 0 ? (
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
            Seçilen tarihte bu film için seans bulunamadı.
          </div>
        ) : (
          <div className="space-y-3">
            {showtimes.map((showtime) => (
              <div
                key={showtime.id}
                className="bg-slate-900 border border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between hover:border-red-500/50 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-base text-white">{showtime.startTime}</span>
                    <span className="px-2 py-0.5 bg-red-600/10 text-red-400 border border-red-500/20 rounded-md text-[10px] font-bold">
                      {showtime.format}
                    </span>
                    <span className="text-[11px] text-slate-400">({showtime.languageType})</span>
                  </div>
                  <p className="text-xs text-slate-400">{showtime.cinemaHall.name}</p>
                  <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
                    ₺{showtime.priceStandard} / tam • ₺{showtime.priceStudent} / öğrenci
                  </p>
                </div>

                <button
                  onClick={() => onSelectShowtime(showtime)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/20 flex items-center gap-1 transition-colors"
                >
                  Koltuk Seç <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trailer Modal simulation */}
      {isPlayingTrailer && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-center p-4">
          <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
            <button
              onClick={() => setIsPlayingTrailer(false)}
              className="absolute top-4 right-4 p-2 bg-black/80 text-white rounded-full z-10"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center p-6">
              <Play className="w-12 h-12 text-red-500 mx-auto mb-2 animate-pulse" />
              <p className="text-sm font-bold text-white mb-1">{movie.title} Fragmanı</p>
              <p className="text-xs text-slate-400">Fragman simülasyonu başlatıldı.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
