import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Server, Code2, ShieldAlert } from 'lucide-react';
import { getApiConfig } from '../../services/apiClient';

interface Props {
  children: React.ReactNode;
  onOpenApiSettings: () => void;
  onOpenSpringBootDocs: () => void;
}

export const MobileContainer: React.FC<Props> = ({
  children,
  onOpenApiSettings,
  onOpenSpringBootDocs,
}) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const config = getApiConfig();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-2 sm:p-6 font-sans selection:bg-red-600 selection:text-white">
      {/* Top Desktop Utility Control Bar */}
      <div className="w-full max-w-4xl mb-4 flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-red-600/30">
            CH
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white">cinema-hub</span>
            <span className="ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
              Mobile App UI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Spring Boot Config Status Badge */}
          <button
            onClick={onOpenApiSettings}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              config.useMock
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
            title="API Ayarlarını Yapılandır"
          >
            <Server className="w-3.5 h-3.5" />
            <span>{config.useMock ? 'Mock REST API' : 'Spring Boot REST API'}</span>
          </button>

          {/* Spring Boot Controller Docs Modal trigger */}
          <button
            onClick={onOpenSpringBootDocs}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Spring Boot Kod Şablonlarını Gör"
          >
            <Code2 className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Spring Backend Kodu</span>
          </button>

          {/* Frame Mode Toggle */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-xs font-medium flex items-center gap-1 transition-colors"
            title={isPhoneFrame ? 'Tam Ekran Görünümüne Geç' : 'Mobil Çerçeveye Geç'}
          >
            {isPhoneFrame ? (
              <Monitor className="w-4 h-4 text-slate-400" />
            ) : (
              <Smartphone className="w-4 h-4 text-red-400" />
            )}
          </button>
        </div>
      </div>

      {/* Main Container Phone Shell / Mobile Screen */}
      <div
        className={`transition-all duration-300 ${
          isPhoneFrame
            ? 'w-full max-w-[420px] h-[850px] max-h-[92vh] rounded-[48px] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(229,9,20,0.25)] relative overflow-hidden bg-slate-900 flex flex-col ring-1 ring-slate-700/50'
            : 'w-full max-w-lg min-h-[800px] rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden bg-slate-900 flex flex-col'
        }`}
      >
        {/* Smartphone Status Bar */}
        {isPhoneFrame && (
          <div className="h-10 bg-slate-950/90 text-slate-300 text-xs font-medium px-6 flex items-center justify-between shrink-0 select-none z-40 border-b border-slate-800/40">
            <span>{currentTime || '09:41'}</span>
            
            {/* Camera Notch */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-1.5 flex items-center justify-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-900/80"></div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">5G</span>
              <Battery className="w-4 h-4 text-slate-200" />
            </div>
          </div>
        )}

        {/* Screen Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-slate-950">
          {children}
        </div>

        {/* Smartphone Home Indicator Bar */}
        {isPhoneFrame && (
          <div className="h-4 bg-slate-950 flex items-center justify-center shrink-0 select-none z-40">
            <div className="w-32 h-1 bg-slate-700/80 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};
