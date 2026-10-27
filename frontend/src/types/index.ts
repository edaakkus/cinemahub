export type Role = 'USER' | 'ADMIN';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  passwordHash?: string;
  password?: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  type: string; // 'Bearer'
  user: User;
}

export type Genre =
  | 'Aksiyon'
  | 'Macera'
  | 'Bilim Kurgu'
  | 'Dram'
  | 'Komedi'
  | 'Korku'
  | 'Animasyon'
  | 'Gerilim'
  | 'Romantik'
  | 'Fantastik';

export interface CastMember {
  name: string;
  roleName: string;
  imageUrl?: string;
}

export interface Movie {
  id: number;
  title: string;
  originalTitle?: string;
  synopsis: string;
  durationMinutes: number;
  rating: number; // e.g. 8.8
  voteCount: number;
  genres: Genre[];
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  director: string;
  cast: CastMember[];
  ageRating: string; // e.g., '13+', '16+', 'Genel İzleyici'
  language: string; // e.g., 'Türkçe Dublaj & Altyazılı'
  trailerUrl?: string;
  isFeatured?: boolean;
  isNowShowing?: boolean;
  isUpcoming?: boolean;
}

export type ScreenFormat = '2D' | '3D' | 'IMAX 3D' | 'VIP Lounge' | 'Dolby Atmos';

export interface CinemaHall {
  id: number;
  name: string; // e.g. 'Salon 1 - IMAX', 'Salon 4 - VIP'
  totalRows: number;
  seatsPerRow: number;
}

export interface Showtime {
  id: number;
  movieId: number;
  cinemaHall: CinemaHall;
  startTime: string; // ISO string or '14:30'
  date: string; // YYYY-MM-DD
  format: ScreenFormat;
  priceStandard: number;
  priceVip: number;
  priceStudent: number;
  languageType: 'Dublaj' | 'Altyazılı';
}

export type SeatCategory = 'STANDARD' | 'VIP' | 'WHEELCHAIR';
export type SeatStatus = 'AVAILABLE' | 'SELECTED' | 'RESERVED' | 'OCCUPIED';

export interface Seat {
  id: string; // e.g. 'A-5'
  row: string; // 'A', 'B', 'C'
  number: number; // 1, 2, 3...
  category: SeatCategory;
  price: number;
  status: SeatStatus;
}

export interface SnackItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'Popcorn' | 'İçecek' | 'Menü' | 'Atıştırmalık';
  imageUrl: string;
}

export interface SnackOrder {
  snackId: number;
  snackName: string;
  quantity: number;
  unitPrice: number;
}

export type TicketStatus = 'ACTIVE' | 'USED' | 'CANCELLED';

export interface Ticket {
  id: number;
  pnrCode: string; // e.g. 'CH-849201'
  userId: number;
  movieTitle: string;
  posterUrl: string;
  hallName: string;
  showtimeDate: string;
  showtimeHour: string;
  format: ScreenFormat;
  seats: string[]; // ['E-4', 'E-5']
  snacks?: SnackOrder[];
  totalAmount: number;
  bookingDate: string;
  qrCodeUrl?: string;
  status: TicketStatus;
}

export interface CreateBookingRequest {
  showtimeId: number;
  seatNumbers: string[];
  ticketType: 'ADULT' | 'STUDENT';
  snacks?: { snackId: number; quantity: number }[];
  paymentMethod: 'CREDIT_CARD' | 'CINEMA_PAY' | 'WALLET';
}

export interface ApiConfig {
  baseUrl: string;
  useMock: boolean;
  authToken: string | null;
}
