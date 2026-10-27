import React from 'react';
import { User as UserIcon, LogOut, Server, Shield, Sparkles, Film, Phone, Mail, Code2, Award, ChevronRight } from 'lucide-react';
import { User } from '../../types';
import { getApiConfig } from '../../services/apiClient';

interface Props {
  currentUser: User | null;
  onLogout: () => void;
  onRequireLogin: () => void;
  onOpenApiSettings: () => void;
  onOpenSpringBootDocs: () => void;
}

export const ProfileScreen: React.FC<Props> = ({
  currentUser,
  onLogout,
  onRequireLogin,
  onOpenApiSettings,
  onOpenSpringBootDocs,
}) => {
  const config = getApiConfig();

  if (!currentUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-100">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
          <UserIcon className="w-8 h-8 text-slate-500" />
        </div>
        <h2 className="text-lg font-bold text-white mb-1">Giriş Yapılmadı</h2>
        <p className="text-xs text-slate-400 max-w-xs mb-6">
          cinema-hub profilinizi yönetmek ve avantajlardan yararlanmak için giriş yapın.
        </p>
        <button
          onClick={onRequireLogin}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30"
        >
          Giriş Yap veya Kaydol
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-slate-950 text-slate-100 scrollbar-thin p-4">
      {/* Profile Card Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 mb-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-lg shadow-red-600/20 shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[14px] overflow-hidden flex items-center justify-center text-xl font-bold text-white">
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
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white truncate">{currentUser.fullName}</h2>
              <span className="px-2 py-0.5 bg-red-600/20 text-red-400 font-bold text-[9px] rounded-md border border-red-500/30">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">{currentUser.email}</p>
            {currentUser.phone && <p className="text-[11px] text-slate-500 mt-0.5">{currentUser.phone}</p>}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-800/80 text-center relative z-10">
          <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
            <span className="block text-base font-black text-white">12</span>
            <span className="text-[10px] text-slate-400">İzlenen Film</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
            <span className="block text-base font-black text-amber-400 flex items-center justify-center gap-0.5">
              <Award className="w-4 h-4 fill-amber-400" /> 450
            </span>
            <span className="text-[10px] text-slate-400">Sinema Puanı</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
            <span className="block text-base font-black text-red-500">6</span>
            <span className="text-[10px] text-slate-400">Aktif Bilet</span>
          </div>
        </div>
      </div>

      {/* Spring Boot REST API Status Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-red-500" />
            <h3 className="font-bold text-xs text-white">Spring Boot REST API Entegrasyonu</h3>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              config.useMock ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}
          >
            {config.useMock ? 'Mock REST Engine' : 'Canlı Sunucu'}
          </span>
        </div>

        <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 truncate mb-3">
          {config.baseUrl}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenApiSettings}
            className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Server className="w-3.5 h-3.5 text-red-400" />
            API Ayarları
          </button>

          <button
            onClick={onOpenSpringBootDocs}
            className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            Kod Kodlama Şablonu
          </button>
        </div>
      </div>

      {/* Account Settings Menu */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80 mb-6">
        <div className="p-3.5 flex items-center justify-between text-xs text-slate-200 hover:bg-slate-850 cursor-pointer">
          <span className="font-medium">Favori Türlerim</span>
          <span className="text-slate-500 text-[11px]">Bilim Kurgu, Aksiyon</span>
        </div>
        <div className="p-3.5 flex items-center justify-between text-xs text-slate-200 hover:bg-slate-850 cursor-pointer">
          <span className="font-medium">Bildirim İzinleri</span>
          <span className="text-emerald-400 text-[11px] font-bold">Açık</span>
        </div>
        <div className="p-3.5 flex items-center justify-between text-xs text-slate-200 hover:bg-slate-850 cursor-pointer">
          <span className="font-medium">Dil & Bölge</span>
          <span className="text-slate-500 text-[11px]">Türkçe (TR)</span>
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={onLogout}
        className="w-full py-3 px-4 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-300 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
      >
        <LogOut className="w-4 h-4 text-rose-400" />
        Oturumu Kapat
      </button>
    </div>
  );
};
