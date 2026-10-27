import React from 'react';
import { Star, Clock, Flame, Play } from 'lucide-react';
import { Movie } from '../../types';

interface Props {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  variant?: 'grid' | 'carousel' | 'horizontal';
}

export const MovieCard: React.FC<Props> = ({ movie, onSelect, variant = 'grid' }) => {
  if (variant === 'carousel') {
    return (
      <div
        onClick={() => onSelect(movie)}
        className="w-[260px] h-[340px] rounded-2xl overflow-hidden relative shrink-0 cursor-pointer group shadow-xl border border-slate-800/80 transform hover:-translate-y-1 transition-all duration-300"
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-4">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2 py-0.5 bg-red-600 text-white font-bold text-[10px] rounded-md shadow-md shadow-red-600/40 flex items-center gap-1">
              <Flame className="w-3 h-3 fill-white" /> Vizyonda
            </span>
            <span className="px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-amber-400 font-bold text-[10px] rounded-md flex items-center gap-1 border border-slate-700/60">
              <Star className="w-3 h-3 fill-amber-400" /> {(movie.rating ?? 0).toFixed(1)}
            </span>
          </div>

          <h3 className="font-bold text-white text-base leading-tight line-clamp-1 group-hover:text-red-400 transition-colors">
            {movie.title}
          </h3>

          <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> {movie.durationMinutes} dk
            </span>
            <span>•</span>
            <span className="truncate max-w-[120px]">{movie.genres.join(', ')}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div
        onClick={() => onSelect(movie)}
        className="flex gap-3 p-2.5 bg-slate-900/80 border border-slate-800/80 rounded-2xl cursor-pointer hover:border-slate-700 hover:bg-slate-900 transition-all group"
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-20 h-28 object-cover rounded-xl shrink-0 group-hover:scale-105 transition-transform"
        />
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">
                {movie.ageRating}
              </span>
              <span className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-slate-950 px-1.5 py-0.5 rounded-md border border-slate-800">
                <Star className="w-3 h-3 fill-amber-400" /> {(movie.rating ?? 0).toFixed(1)}
              </span>
            </div>
            <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-red-400 transition-colors">
              {movie.title}
            </h4>
            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{movie.genres.join(' • ')}</p>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" /> {movie.durationMinutes} dk
            </span>
            <span className="text-red-400 font-semibold group-hover:underline flex items-center gap-1">
              Bilet Al <Play className="w-3 h-3 fill-red-400" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Standard Grid
  return (
    <div
      onClick={() => onSelect(movie)}
      className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden cursor-pointer group hover:border-red-500/50 hover:shadow-lg hover:shadow-red-600/10 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-amber-400 text-[10px] font-bold flex items-center gap-1 border border-slate-800">
          <Star className="w-3 h-3 fill-amber-400" /> {(movie.rating ?? 0).toFixed(1)}
        </div>
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-slate-300 font-medium">
          {movie.durationMinutes} dk
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-xs text-white line-clamp-1 group-hover:text-red-400 transition-colors">
            {movie.title}
          </h3>
          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
            {movie.genres.slice(0, 2).join(', ')}
          </p>
        </div>

        <button className="mt-3 w-full py-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1">
          Bilet Al
        </button>
      </div>
    </div>
  );
};
