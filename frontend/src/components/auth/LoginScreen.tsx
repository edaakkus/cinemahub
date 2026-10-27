import React, { useState } from 'react';
import { Mail, Lock, LogIn, Sparkles, AlertCircle, Eye, EyeOff, Film } from 'lucide-react';
import { authService } from '../../services/authService';
import { User } from '../../types';

interface Props {
  onSuccess: (user: User) => void;
  onGoToRegister: () => void;
  onSkip?: () => void;
}

export const LoginScreen: React.FC<Props> = ({ onSuccess, onGoToRegister, onSkip }) => {
  const [email, setEmail] = useState('arda.yilmaz@cinemahub.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authService.login({ email, password });
      onSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-slate-950 text-slate-100 overflow-y-auto">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full my-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-red-600 via-red-500 to-amber-500 mx-auto mb-4 flex items-center justify-center text-white shadow-xl shadow-red-600/30 border border-red-400/20">
            <Film className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            cinema<span className="text-red-600">hub</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Spring Boot REST API Entegreli Sinema Dünyası
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              E-Posta Adresi
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@cinemahub.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Şifre
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Giriş Yap (/api/v1/auth/login)
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400 space-y-3">
          <p>
            Hesabınız yok mu?{' '}
            <button
              onClick={onGoToRegister}
              className="text-red-400 font-bold hover:underline"
            >
              Hemen Kaydolun
            </button>
          </p>

          {onSkip && (
            <button
              onClick={onSkip}
              className="text-slate-500 hover:text-slate-300 text-xs font-medium block mx-auto underline"
            >
              Misafir Olarak Devam Et →
            </button>
          )}
        </div>
      </div>

      <div className="text-center pt-4 border-t border-slate-900 text-[11px] text-slate-600">
        Spring Boot 3 + Security JWT Entegrasyonu
      </div>
    </div>
  );
};
