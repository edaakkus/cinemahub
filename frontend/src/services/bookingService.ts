import { CreateBookingRequest, Seat, Ticket } from '../types';
import { requestApi } from './apiClient';
import { INITIAL_TICKETS, MOCK_MOVIES, MOCK_SHOWTIMES, MOCK_SNACKS } from '../data/mockData';

const TICKETS_STORAGE_KEY = 'cinema_hub_tickets_v1';
const OCCUPIED_SEATS_KEY = 'cinema_hub_occupied_seats_v1';

function getStoredTickets(): Ticket[] {
  try {
    const data = localStorage.getItem(TICKETS_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_TICKETS;
  } catch {
    return INITIAL_TICKETS;
  }
}

function saveStoredTickets(tickets: Ticket[]) {
  localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
}

function getStoredOccupiedSeats(showtimeId: number): string[] {
  try {
    const data = localStorage.getItem(OCCUPIED_SEATS_KEY);
    const map = data ? JSON.parse(data) : {};
    return map[showtimeId] || ['C-3', 'C-4', 'D-5', 'E-1', 'E-2'];
  } catch {
    return ['C-3', 'C-4', 'D-5', 'E-1', 'E-2'];
  }
}

function addStoredOccupiedSeats(showtimeId: number, seatNumbers: string[]) {
  try {
    const data = localStorage.getItem(OCCUPIED_SEATS_KEY);
    const map = data ? JSON.parse(data) : {};
    const existing = map[showtimeId] || ['C-3', 'C-4', 'D-5', 'E-1', 'E-2'];
    map[showtimeId] = Array.from(new Set([...existing, ...seatNumbers]));
    localStorage.setItem(OCCUPIED_SEATS_KEY, JSON.stringify(map));
  } catch (e) {
    console.error(e);
  }
}

interface BackendTicketResponse {
  id: number;
  showTimeId: number;
  movieTitle: string;
  posterUrl?: string;
  hallName?: string;
  showStartTime?: string;
  seatId: number;
  seatLabel: string;
  price?: number;
  userId?: number;
  purchaseTime: string;
}

export const bookingService = {
  /**
   * Koltuk listesini ve seansın dolu koltuklarını getirir
   */
  async getSeatsForShowtime(showtimeId: number): Promise<Seat[]> {
    try {
      const occupiedSeatIds = await requestApi<number[]>(`/tickets/occupied-seats/${showtimeId}`, 'GET');
      const showtime = await requestApi<any>(`/showtimes/${showtimeId}`, 'GET');
      const hallId = showtime.hallId || 1;
      const backendSeats = await requestApi<any[]>(`/seats?hallId=${hallId}`, 'GET');

      if (backendSeats && backendSeats.length > 0) {
        return backendSeats.map((bs) => {
          const rowChar = String.fromCharCode(64 + (bs.rowNumber || 1));
          const isOccupied = occupiedSeatIds.includes(bs.id);
          const isVip = bs.rowNumber >= 7;

          return {
            id: bs.id.toString(),
            row: rowChar,
            number: bs.seatNumber,
            category: isVip ? 'VIP' : 'STANDARD',
            price: isVip ? (showtime.price + 50) : showtime.price,
            status: isOccupied ? 'OCCUPIED' : 'AVAILABLE',
          };
        });
      }
    } catch (e) {
      console.warn('Backend koltuk verisi alınamadı, yerel şemaya geçiliyor:', e);
    }

    // Fallback: Grid şeması
    const occupiedSeats = getStoredOccupiedSeats(showtimeId);
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const totalRows = 8;
    const seatsPerRow = 8;
    const seats: Seat[] = [];

    for (let r = 0; r < totalRows; r++) {
      const rowChar = rows[r];
      const isVipRow = r >= 6;

      for (let num = 1; num <= seatsPerRow; num++) {
        const seatId = `${rowChar}-${num}`;
        const isOccupied = occupiedSeats.includes(seatId);

        seats.push({
          id: `${(r * 8) + num}`,
          row: rowChar,
          number: num,
          category: isVipRow ? 'VIP' : 'STANDARD',
          price: isVipRow ? 270 : 220,
          status: isOccupied ? 'OCCUPIED' : 'AVAILABLE',
        });
      }
    }
    return seats;
  },

  /**
   * POST /api/tickets
   */
  async createBooking(req: CreateBookingRequest, userId: number): Promise<Ticket> {
    try {
      // Backend'e her seçilen koltuk için bilet kaydı atıyoruz
      const ticketPromises = req.seatNumbers.map(async (seatId) => {
        const numId = Number(seatId) || 1;
        return await requestApi<BackendTicketResponse>('/tickets', 'POST', {
          showTimeId: req.showtimeId,
          seatId: numId,
        });
      });

      const backendTickets = await Promise.all(ticketPromises);
      const first = backendTickets[0];

      const randomPnr = 'CH-' + Math.floor(100000 + Math.random() * 900000);
      const createdTicket: Ticket = {
        id: first.id,
        pnrCode: randomPnr,
        userId: userId || 1,
        movieTitle: first.movieTitle || 'Film',
        posterUrl: first.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
        hallName: first.hallName || 'Salon 1',
        showtimeDate: first.showStartTime ? first.showStartTime.split('T')[0] : new Date().toISOString().split('T')[0],
        showtimeHour: first.showStartTime && first.showStartTime.includes('T') ? first.showStartTime.split('T')[1].substring(0, 5) : '19:00',
        format: 'IMAX 3D',
        seats: backendTickets.map(t => t.seatLabel || `Koltuk-${t.seatId}`),
        totalAmount: (first.price ? Number(first.price) : 220) * req.seatNumbers.length,
        bookingDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PNR-${randomPnr}`,
        status: 'ACTIVE',
      };

      const tickets = getStoredTickets();
      tickets.unshift(createdTicket);
      saveStoredTickets(tickets);

      return createdTicket;
    } catch (error) {
      console.warn('Backend bilet oluşturma başarısız, yerel kayıt oluşturuluyor:', error);
      const showtime = MOCK_SHOWTIMES.find((s) => s.id === Number(req.showtimeId)) || MOCK_SHOWTIMES[0];
      const movie = MOCK_MOVIES.find((m) => m.id === showtime.movieId) || MOCK_MOVIES[0];

      const isStudent = req.ticketType === 'STUDENT';
      const perSeatPrice = isStudent ? showtime.priceStudent : showtime.priceStandard;
      const ticketTotal = req.seatNumbers.length * perSeatPrice;
      const randomPnr = 'CH-' + Math.floor(100000 + Math.random() * 900000);

      const newTicket: Ticket = {
        id: Date.now(),
        pnrCode: randomPnr,
        userId: userId || 1,
        movieTitle: movie.title,
        posterUrl: movie.posterUrl,
        hallName: showtime.cinemaHall.name,
        showtimeDate: showtime.date,
        showtimeHour: showtime.startTime,
        format: showtime.format,
        seats: req.seatNumbers,
        totalAmount: ticketTotal,
        bookingDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PNR-${randomPnr}`,
        status: 'ACTIVE',
      };

      addStoredOccupiedSeats(showtime.id, req.seatNumbers);
      const tickets = getStoredTickets();
      tickets.unshift(newTicket);
      saveStoredTickets(tickets);

      return newTicket;
    }
  },

  /**
   * GET /api/tickets/my-tickets
   */
  async getUserTickets(userId: number): Promise<Ticket[]> {
    try {
      const response = await requestApi<BackendTicketResponse[]>('/tickets/my-tickets', 'GET');
      if (response && response.length > 0) {
        return response.map((bt) => ({
          id: bt.id,
          pnrCode: 'CH-' + (bt.id * 1234).toString().padStart(6, '0'),
          userId: bt.userId || userId,
          movieTitle: bt.movieTitle,
          posterUrl: bt.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
          hallName: bt.hallName || 'Salon 1',
          showtimeDate: bt.showStartTime ? bt.showStartTime.split('T')[0] : '',
          showtimeHour: bt.showStartTime && bt.showStartTime.includes('T') ? bt.showStartTime.split('T')[1].substring(0, 5) : '19:00',
          format: '2D',
          seats: [bt.seatLabel],
          totalAmount: bt.price ? Number(bt.price) : 220,
          bookingDate: bt.purchaseTime ? bt.purchaseTime.replace('T', ' ').substring(0, 16) : '',
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET-${bt.id}`,
          status: 'ACTIVE',
        }));
      }
      return getStoredTickets();
    } catch {
      const tickets = getStoredTickets();
      return tickets.filter((t) => t.userId === userId || userId === 1);
    }
  },

  /**
   * DELETE /api/tickets/{id}
   */
  async cancelTicket(ticketId: number): Promise<Ticket> {
    try {
      await requestApi<void>(`/tickets/${ticketId}`, 'DELETE');
    } catch (e) {
      console.warn('Backend bilet silme hatası:', e);
    }

    const tickets = getStoredTickets();
    const ticketIndex = tickets.findIndex((t) => t.id === ticketId);
    if (ticketIndex !== -1) {
      tickets[ticketIndex].status = 'CANCELLED';
      saveStoredTickets(tickets);
      return tickets[ticketIndex];
    }
    return { id: ticketId } as Ticket;
  }
};
