import React, { useState, useEffect } from 'react';
import { ArrowLeft, Monitor, Info, Popcorn, Check, Ticket as TicketIcon, AlertCircle } from 'lucide-react';
import { Movie, Seat, Showtime, SnackOrder, User } from '../../types';
import { bookingService } from '../../services/bookingService';
import { SnackSelectionModal } from './SnackSelectionModal';

interface Props {
  showtime: Showtime;
  movie: Movie;
  currentUser: User | null;
  onBack: () => void;
  onBookingCreated: (ticketId: number) => void;
  onRequireLogin: () => void;
}

export const SeatSelectionScreen: React.FC<Props> = ({
  showtime,
  movie,
  currentUser,
  onBack,
  onBookingCreated,
  onRequireLogin,
}) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [ticketType, setTicketType] = useState<'ADULT' | 'STUDENT'>('ADULT');
  const [snacks, setSnacks] = useState<SnackOrder[]>([]);
  const [isSnackModalOpen, setIsSnackModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    bookingService
      .getSeatsForShowtime(showtime.id)
      .then((data) => setSeats(data))
      .catch(() => setError('Koltuk düzeni yüklenemedi.'))
      .finally(() => setLoading(false));
  }, [showtime.id]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status === 'OCCUPIED') return;

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= 6) {
        alert('Tek seferde en fazla 6 koltuk seçebilirsiniz.');
        return;
      }
      setSelectedSeatIds([...selectedSeatIds, seat.id]);
    }
  };

  // Calculate pricing
  const totalTicketPrice = selectedSeatIds.reduce((sum, seatId) => {
    const seatObj = seats.find((s) => s.id === seatId);
    if (!seatObj) return sum;
    if (ticketType === 'STUDENT') return sum + showtime.priceStudent;
    return sum + (seatObj.category === 'VIP' ? showtime.priceVip : showtime.priceStandard);
  }, 0);

  const totalSnacksPrice = snacks.reduce((sum, s) => sum + s.unitPrice * s.quantity, 0);
  const totalPrice = totalTicketPrice + totalSnacksPrice;

  const handleConfirmBooking = async () => {
    if (!currentUser) {
      onRequireLogin();
      return;
    }

    if (selectedSeatIds.length === 0) {
      alert('Lütfen en az 1 koltuk seçiniz.');
      return;
    }

    setBookingInProgress(true);
    setError('');

    try {
      const ticket = await bookingService.createBooking(
        {
          showtimeId: showtime.id,
          seatNumbers: selectedSeatIds,
          ticketType,
          snacks: snacks.map((s) => ({ snackId: s.snackId, quantity: s.quantity })),
          paymentMethod: 'CREDIT_CARD',
        },
        currentUser.id
      );

      onBookingCreated(ticket.id);
    } catch (err: any) {
      setError(err.message || 'Bilet oluşturulurken hata oluştu.');
    } finally {
      setBookingInProgress(false);
    }
  };

  // Group seats by row for clean grid rendering
  const rowsMap: Record<string, Seat[]> = {};
  seats.forEach((seat) => {
    if (!rowsMap[seat.row]) rowsMap[seat.row] = [];
    rowsMap[seat.row].push(seat);
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-sm text-white truncate max-w-[200px]">{movie.title}</h2>
            <p className="text-[11px] text-slate-400">
              {showtime.cinemaHall.name} • {showtime.startTime}
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-red-600/10 text-red-400 border border-red-500/20 text-xs font-bold rounded-lg">
          {showtime.format}
        </span>
      </div>

      {/* Main Seat Grid Container */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-start scrollbar-thin">
        {/* Cinema Screen Banner Curve */}
        <div className="w-full max-w-xs mb-6 text-center">
          <div className="w-full h-3 bg-gradient-to-b from-red-500 to-red-800/20 rounded-t-full shadow-[0_10px_20px_rgba(229,9,20,0.3)] border-t-2 border-red-400" />
          <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-500 mt-1">
            BEYAZ PERDE
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mb-6 text-[11px] text-slate-400 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-slate-800 border border-slate-700" />
            <span>Boş</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-red-600 shadow-sm shadow-red-600" />
            <span>Seçili</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-slate-900 opacity-40 border border-slate-800" />
            <span>Dolu</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-amber-500/30 border border-amber-500" />
            <span>VIP</span>
          </div>
        </div>

        {/* Seats Grid */}
        {loading ? (
          <div className="my-12 text-xs text-slate-500">Koltuk düzeni yükleniyor...</div>
        ) : (
          <div className="space-y-2 mb-6 max-w-sm w-full">
            {Object.keys(rowsMap).map((rowChar) => (
              <div key={rowChar} className="flex items-center justify-center gap-2">
                <span className="w-4 text-[10px] font-bold text-slate-500 text-center">
                  {rowChar}
                </span>

                <div className="flex items-center gap-1.5">
                  {rowsMap[rowChar].map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.id);
                    const isOccupied = seat.status === 'OCCUPIED';
                    const isVip = seat.category === 'VIP';

                    return (
                      <button
                        key={seat.id}
                        disabled={isOccupied}
                        onClick={() => toggleSeat(seat)}
                        className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center ${
                          isOccupied
                            ? 'bg-slate-900 text-slate-700 opacity-40 cursor-not-allowed border border-slate-800'
                            : isSelected
                            ? 'bg-red-600 text-white shadow-md shadow-red-600/50 scale-105 ring-2 ring-white/50'
                            : isVip
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
                            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                        }`}
                        title={`${seat.id} - ${seat.category} (${seat.price} TL)`}
                      >
                        {seat.number}
                      </button>
                    );
                  })}
                </div>

                <span className="w-4 text-[10px] font-bold text-slate-500 text-center">
                  {rowChar}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Selected Seat Summary Badges */}
        <div className="w-full max-w-sm bg-slate-900/60 border border-slate-800 rounded-2xl p-3 mb-4">
          <div className="text-xs font-bold text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Seçilen Koltuklar:</span>
            <span className="text-white font-black">{selectedSeatIds.length} Koltuk</span>
          </div>

          {selectedSeatIds.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Henüz koltuk seçilmedi</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {selectedSeatIds.map((id) => (
                <span
                  key={id}
                  className="px-2 py-0.5 bg-red-600 text-white font-bold text-xs rounded-md shadow-sm"
                >
                  {id}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Payment & Ticket Type Selector */}
      <div className="p-4 bg-slate-950/95 border-t border-slate-800 backdrop-blur-lg shrink-0 space-y-3">
        {/* Ticket Type Selector */}
        <div className="flex items-center justify-between bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="font-semibold text-slate-400 pl-2">Bilet Tipi:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTicketType('ADULT')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                ticketType === 'ADULT'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tam (₺{showtime.priceStandard})
            </button>
            <button
              onClick={() => setTicketType('STUDENT')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                ticketType === 'STUDENT'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Öğrenci (₺{showtime.priceStudent})
            </button>
          </div>
        </div>

        {/* Snack Addon trigger button */}
        <button
          onClick={() => setIsSnackModalOpen(true)}
          className="w-full py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <Popcorn className="w-4 h-4 text-amber-400" />
            {snacks.length > 0 ? `${snacks.length} Mısır & İçecek Ekli` : 'Mısır & İçecek Ekle'}
          </span>
          <span className="font-extrabold text-white">
            {snacks.length > 0 ? `+₺${totalSnacksPrice}` : 'Menüyü Gör →'}
          </span>
        </button>

        {error && (
          <div className="p-2.5 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Final Confirm Button */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Toplam Tutar</span>
            <p className="text-xl font-black text-white">₺{totalPrice}</p>
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={selectedSeatIds.length === 0 || bookingInProgress}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl text-xs font-black shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {bookingInProgress ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <TicketIcon className="w-4 h-4" />
                Ödemeyi Tamamla ({selectedSeatIds.length} Bilet)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Snack Selector Modal */}
      <SnackSelectionModal
        isOpen={isSnackModalOpen}
        onClose={() => setIsSnackModalOpen(false)}
        selectedSnacks={snacks}
        onSaveSnacks={(updated) => setSnacks(updated)}
      />
    </div>
  );
};
