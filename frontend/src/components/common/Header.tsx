import React from 'react';
import { ArrowLeft, Search, Bell, Film, Server } from 'lucide-react';
import { User } from '../../types';

interface Props {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  currentUser: User | null;
  onOpenSearch?: () => void;
  onOpenApiSettings?: () => void;
  activeTicketsCount?: number;
}

export const Header: React.FC<Props> = ({
  title,
  showBack,
  onBack,
  currentUser,
  onOpenSearch,
  onOpenApiSettings,
}) => {
  return (
    <header className="h-14 px-4 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between shrink-0 z-30 sticky top-0">
      {showBack ? (
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
            aria-label="Geri Dön"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          {title && <h2 className="font-bold text-base text-white truncate max-w-[200px]">{title}</h2>}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 text-white shadow-md shadow-red-600/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-base text-white tracking-tight flex items-center gap-1.5">
              cinema<span className="text-red-600">hub</span>
            </h1>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        {onOpenSearch && !showBack && (
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800 transition-colors"
            aria-label="Arama Yap"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onOpenApiSettings}
          className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800 transition-colors relative"
          title="Spring Boot API Ayarları"
        >
          <Server className="w-4 h-4 text-red-500" />
        </button>

        {currentUser ? (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white overflow-hidden shadow-inner">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              currentUser.fullName.charAt(0).toUpperCase()
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
};
