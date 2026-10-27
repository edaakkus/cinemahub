import React from 'react';
import { X, Calendar, Clock, MapPin, QrCode, Trash2, CheckCircle2, Ticket as TicketIcon } from 'lucide-react';
import { Ticket } from '../../types';

interface Props {
  ticket: Ticket | null;
  onClose: () => void;
  onCancelTicket?: (ticketId: number) => void;
}

export const TicketDetailModal: React.FC<Props> = ({ ticket, onClose, onCancelTicket }) => {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 text-slate-100 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ticket Header Visual */}
        <div className="flex gap-3 items-center mb-4 pb-4 border-b border-slate-800">
          <img
            src={ticket.posterUrl}
            alt={ticket.movieTitle}
            className="w-16 h-22 object-cover rounded-xl shadow-lg border border-slate-700 shrink-0"
          />
          <div>
            <span className="px-2 py-0.5 bg-red-600/20 text-red-400 font-bold text-[10px] rounded-md border border-red-500/30">
              PNR: {ticket.pnrCode}
            </span>
            <h3 className="font-extrabold text-base text-white mt-1 leading-snug">{ticket.movieTitle}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{ticket.hallName}</p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white p-4 rounded-2xl text-center mb-4 shadow-inner flex flex-col items-center justify-center">
          <img
            src={ticket.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${ticket.pnrCode}`}
            alt="Ticket QR Code"
            className="w-36 h-36 object-contain"
          />
          <p className="text-[10px] font-mono font-bold text-slate-900 mt-2 tracking-widest">
            {ticket.pnrCode}
          </p>
          <p className="text-[9px] text-slate-500">Girişte okutunuz veya gişeye bildiriniz</p>
        </div>

        {/* Ticket Info Grid */}
        <div className="space-y-2.5 text-xs bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 mb-4 flex-1 overflow-y-auto scrollbar-thin">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-500 font-medium">Tarih & Saat:</span>
            <span className="font-bold text-white">
              {ticket.showtimeDate} • {ticket.showtimeHour}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-500 font-medium">Koltuklar:</span>
            <div className="flex gap-1 flex-wrap">
              {ticket.seats.map((s) => (
                <span key={s} className="px-1.5 py-0.5 bg-red-600 text-white font-bold rounded text-[10px]">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-500 font-medium">Format:</span>
            <span className="font-bold text-red-400">{ticket.format}</span>
          </div>

          {ticket.snacks && ticket.snacks.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-500 font-medium block mb-1">Büfe Siparişleri:</span>
              <ul className="space-y-1">
                {ticket.snacks.map((sn, idx) => (
                  <li key={idx} className="flex justify-between text-slate-300 font-semibold">
                    <span>
                      {sn.quantity}x {sn.snackName}
                    </span>
                    <span>₺{sn.unitPrice * sn.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
            <span className="font-bold text-slate-400">Ödenen Tutar:</span>
            <span className="font-black text-white text-base">₺{ticket.totalAmount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800 shrink-0">
          {ticket.status === 'ACTIVE' && onCancelTicket && (
            <button
              onClick={() => {
                if (confirm('Bileti iptal etmek istediğinize emin misiniz?')) {
                  onCancelTicket(ticket.id);
                  onClose();
                }
              }}
              className="flex-1 py-2.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Bileti İptal Et
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
