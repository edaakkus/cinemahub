import React, { useState, useEffect } from 'react';
import { Ticket as TicketIcon, Calendar, Clock, QrCode, RefreshCw, AlertCircle, ChevronRight } from 'lucide-react';
import { Ticket, User } from '../../types';
import { bookingService } from '../../services/bookingService';
import { TicketDetailModal } from './TicketDetailModal';

interface Props {
  currentUser: User | null;
  onRequireLogin: () => void;
}

export const MyTicketsScreen: React.FC<Props> = ({ currentUser, onRequireLogin }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'PAST'>('ACTIVE');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await bookingService.getUserTickets(currentUser.id);
      setTickets(data);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-100">
        <div className="w-16 h-16 rounded-3xl bg-red-600/10 text-red-500 border border-red-500/20 flex items-center justify-center mb-4 shadow-lg shadow-red-600/10">
          <TicketIcon className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Biletlerinizi Görün</h2>
        <p className="text-xs text-slate-400 max-w-xs mb-6">
          Satın aldığınız tüm sinema biletlerine ve QR kodlarına erişmek için giriş yapın.
        </p>
        <button
          onClick={onRequireLogin}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all"
        >
          Giriş Yap veya Kaydol
        </button>
      </div>
    );
  }

  const activeTickets = tickets.filter((t) => t.status === 'ACTIVE');
  const pastTickets = tickets.filter((t) => t.status !== 'ACTIVE');

  const displayedTickets = activeTab === 'ACTIVE' ? activeTickets : pastTickets;

  const handleCancelTicket = async (ticketId: number) => {
    try {
      await bookingService.cancelTicket(ticketId);
      loadTickets();
    } catch (e: any) {
      alert(e.message || 'Bilet iptal edilemedi.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-slate-950 text-slate-100 scrollbar-thin p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <TicketIcon className="w-5 h-5 text-red-500" />
            Biletlerim
          </h2>
          <p className="text-xs text-slate-400">cinema-hub dijital bilet cüzdanınız</p>
        </div>

        <button
          onClick={loadTickets}
          className="p-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-red-500' : ''}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 mb-5">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'ACTIVE'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Aktif Biletler ({activeTickets.length})
        </button>
        <button
          onClick={() => setActiveTab('PAST')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'PAST'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Geçmiş ({pastTickets.length})
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Biletler yükleniyor...</div>
      ) : displayedTickets.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800/60 p-6">
          <TicketIcon className="w-10 h-10 text-slate-700 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-400">
            {activeTab === 'ACTIVE' ? 'Aktif biletiniz bulunmuyor.' : 'Geçmiş bilet kaydı yok.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {displayedTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="bg-slate-900 border border-slate-800 hover:border-red-500/50 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-lg hover:shadow-red-600/5 group"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
                <span className="text-[11px] font-mono font-bold text-red-400">
                  PNR: {ticket.pnrCode}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    ticket.status === 'ACTIVE'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : ticket.status === 'CANCELLED'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {ticket.status === 'ACTIVE'
                    ? 'Hazır / Aktif'
                    : ticket.status === 'CANCELLED'
                    ? 'İptal Edildi'
                    : 'Kullanıldı'}
                </span>
              </div>

              <div className="flex gap-3 items-center">
                <img
                  src={ticket.posterUrl}
                  alt={ticket.movieTitle}
                  className="w-14 h-20 object-cover rounded-xl border border-slate-800 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-white truncate group-hover:text-red-400 transition-colors">
                    {ticket.movieTitle}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{ticket.hallName}</p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-red-500" />
                      {ticket.showtimeDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-red-500" />
                      {ticket.showtimeHour}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:border-red-500/50 group-hover:text-red-400">
                    <QrCode className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span>Koltuklar: <strong className="text-white">{ticket.seats.join(', ')}</strong></span>
                <span className="font-black text-white">₺{ticket.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onCancelTicket={handleCancelTicket}
      />
    </div>
  );
};
