import React, { useState } from 'react';
import { ApiConfig } from '../../types';
import { getApiConfig, saveApiConfig } from '../../services/apiClient';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw, Key, Globe } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const ApiSettingsModal: React.FC<Props> = ({ isOpen, onClose, onConfigUpdated }) => {
  const [config, setConfig] = useState<ApiConfig>(getApiConfig());
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    saveApiConfig(config);
    onConfigUpdated();
    onClose();
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('');
    try {
      const url = `${config.baseUrl.replace(/\/$/, '')}/movies`;
      const headers: Record<string, string> = { 'Accept': 'application/json' };
      if (config.authToken) {
        headers['Authorization'] = `Bearer ${config.authToken}`;
      }

      const res = await fetch(url, { method: 'GET', headers });
      if (res.ok) {
        setTestStatus('success');
        setTestMessage(`Spring Boot REST API bağlantısı başarılı! (${res.status} OK)`);
      } else {
        setTestStatus('error');
        setTestMessage(`Sunucu yanıt verdi ancak hata döndü: ${res.status} ${res.statusText}`);
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(`Bağlantı kurulamadı (${config.baseUrl}). Spring Boot uygulamanızın çalıştığından ve CORS izinlerinin açık olduğundan emin olun.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Spring Boot REST API Entegrasyonu</h3>
            <p className="text-xs text-slate-400">cinema-hub backend servis ayarları</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          {/* Mode Switcher */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-200">Mod Seçimi</p>
              <p className="text-xs text-slate-400">
                {config.useMock
                  ? 'Simüle Edilmiş Mock API (Spring Boot DTO Standartlı)'
                  : 'Canlı Spring Boot Backend'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!config.useMock}
                onChange={(e) => setConfig({ ...config, useMock: !e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          {/* Base URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-red-400" />
              Spring Boot API Base URL
            </label>
            <input
              type="text"
              value={config.baseUrl}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
              placeholder="http://localhost:8080/api/v1"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-red-500 font-mono text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Lokal Spring Boot uygulamanız için varsayılan: <code className="text-red-400">http://localhost:8080/api/v1</code>
            </p>
          </div>

          {/* JWT Token */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              Bearer JWT Token (İsteğe Bağlı)
            </label>
            <input
              type="text"
              value={config.authToken || ''}
              onChange={(e) => setConfig({ ...config, authToken: e.target.value || null })}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-red-500 font-mono text-xs"
            />
          </div>

          {/* Connection Test feedback */}
          {!config.useMock && (
            <div className="pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus === 'testing'}
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                {testStatus === 'testing' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-400" />
                    Test Ediliyor...
                  </>
                ) : (
                  <>
                    <Server className="w-3.5 h-3.5 text-red-400" />
                    Spring Boot Bağlantısını Test Et
                  </>
                )}
              </button>

              {testStatus === 'success' && (
                <div className="mt-2.5 p-2.5 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{testMessage}</span>
                </div>
              )}

              {testStatus === 'error' && (
                <div className="mt-2.5 p-2.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{testMessage}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-600/20 transition-all"
          >
            Ayarları Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};
