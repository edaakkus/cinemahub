import { Showtime } from '../types';
import { requestApi } from './apiClient';
import { MOCK_SHOWTIMES } from '../data/mockData';

interface BackendShowTime {
  id: number;
  movieId: number;
  movieTitle: string;
  hallId: number;
  hallName: string;
  startTime: string;
  price: number;
}

function mapBackendShowtime(st: BackendShowTime): Showtime {
  const datePart = st.startTime ? st.startTime.split('T')[0] : new Date().toISOString().split('T')[0];
  const timePart = st.startTime && st.startTime.includes('T')
    ? st.startTime.split('T')[1].substring(0, 5)
    : '19:00';

  const isImax = st.hallName ? st.hallName.toUpperCase().includes('IMAX') : false;
  const isVip = st.hallName ? st.hallName.toUpperCase().includes('VIP') : false;
  const format = isImax ? 'IMAX 3D' : isVip ? 'VIP Lounge' : '2D';

  const standardPrice = Number(st.price) || 220;

  return {
    id: st.id,
    movieId: st.movieId,
    cinemaHall: {
      id: st.hallId || 1,
      name: st.hallName || 'Salon 1',
      totalRows: isVip ? 5 : 8,
      seatsPerRow: 8,
    },
    startTime: timePart,
    date: datePart,
    format: format,
    priceStandard: standardPrice,
    priceVip: standardPrice + 50,
    priceStudent: Math.max(120, standardPrice - 30),
    languageType: 'Dublaj',
  };
}

export const showtimeService = {
  /**
   * GET /api/showtimes?movieId={movieId}
   */
  async getShowtimesByMovie(movieId: number, date?: string): Promise<Showtime[]> {
    try {
      const response = await requestApi<BackendShowTime[]>(`/showtimes?movieId=${movieId}`, 'GET');
      let mapped = response.map(mapBackendShowtime);

      if (date) {
        mapped = mapped.filter((s) => s.date === date);
      }
      return mapped;
    } catch {
      let filtered = MOCK_SHOWTIMES.filter((s) => s.movieId === Number(movieId));
      if (date) {
        filtered = filtered.filter((s) => s.date === date);
      }
      return filtered;
    }
  },

  /**
   * GET /api/showtimes/{id}
   */
  async getShowtimeById(showtimeId: number): Promise<Showtime> {
    try {
      const response = await requestApi<BackendShowTime>(`/showtimes/${showtimeId}`, 'GET');
      return mapBackendShowtime(response);
    } catch {
      const found = MOCK_SHOWTIMES.find((s) => s.id === Number(showtimeId));
      if (!found) {
        throw new Error('Seans bulunamadı.');
      }
      return found;
    }
  },

  /**
   * GET /api/v1/showtimes/dates
   * Get available booking dates (Today, Tomorrow, next 5 days)
   */
  getAvailableDates(): { dayName: string; dayNumber: string; dateStr: string; isToday: boolean }[] {
    const dates = [];
    const today = new Date();
    const turkishDays = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const dayName = i === 0 ? 'Bugün' : i === 1 ? 'Yarın' : turkishDays[d.getDay()];
      const dayNumber = d.getDate().toString();
      const dateStr = d.toISOString().split('T')[0];

      dates.push({
        dayName,
        dayNumber,
        dateStr,
        isToday: i === 0,
      });
    }

    return dates;
  }
};
