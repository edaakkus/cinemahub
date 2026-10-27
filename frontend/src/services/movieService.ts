import { Genre, Movie } from '../types';
import { requestApi } from './apiClient';
import { MOCK_MOVIES } from '../data/mockData';

interface BackendMovie {
  id: number;
  title: string;
  genre: string;
  duration: number;
  releaseYear: number;
  posterUrl?: string;
  backdropUrl?: string;
  synopsis?: string;
  rating?: number;
  director?: string;
  ageRating?: string;
  trailerUrl?: string;
}

// Backend'den gelen MovieResponseDto'yu
// frontend'in beklediği Movie modeline dönüştürür.
function mapBackendMovieToMovie(movie: BackendMovie): Movie {
  const genreMap: Record<string, Genre> = {
    'Sci-Fi': 'Bilim Kurgu',
    'Bilim Kurgu': 'Bilim Kurgu',
    'Action': 'Aksiyon',
    'Aksiyon': 'Aksiyon',
    'Adventure': 'Macera',
    'Macera': 'Macera',
    'Drama': 'Dram',
    'Dram': 'Dram',
    'Comedy': 'Komedi',
    'Komedi': 'Komedi',
    'Horror': 'Korku',
    'Korku': 'Korku',
    'Animation': 'Animasyon',
    'Animasyon': 'Animasyon',
    'Thriller': 'Gerilim',
    'Gerilim': 'Gerilim',
    'Romance': 'Romantik',
    'Romantik': 'Romantik',
    'Fantasy': 'Fantastik',
    'Fantastik': 'Fantastik',
  };

  const defaultPoster = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500';

  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.title,
    synopsis: movie.synopsis || 'Harika bir sinema deneyimi sizleri bekliyor.',
    durationMinutes: movie.duration ?? 120,
    rating: movie.rating || 8.0,
    voteCount: 1420,
    genres: [genreMap[movie.genre] || 'Dram'],
    posterUrl: movie.posterUrl || defaultPoster,
    backdropUrl: movie.backdropUrl || movie.posterUrl || defaultPoster,
    releaseDate: `${movie.releaseYear || 2024}-01-01`,
    director: movie.director || 'Yönetmen Bilgisi',
    cast: [],
    ageRating: movie.ageRating || 'Genel İzleyici',
    language: 'Türkçe Dublaj & Altyazılı',
    trailerUrl: movie.trailerUrl,
    isNowShowing: true,
    isUpcoming: false,
    isFeatured: (movie.rating || 0) >= 8.5,
  };
}

export const movieService = {

  /**
   * GET /api/movies
   */
  async getMovies(
    genre?: Genre | 'Tümü',
    search?: string
  ): Promise<Movie[]> {
    try {
      const queryParams = new URLSearchParams();

      if (genre && genre !== 'Tümü') {
        queryParams.append('genre', genre);
      }

      if (search) {
        queryParams.append('search', search);
      }

      const endpoint =
        `/movies${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      const response = await requestApi<BackendMovie[]>(
        endpoint,
        'GET'
      );

      return response.map(mapBackendMovieToMovie);

    } catch (error: any) {
      console.warn('Film API kullanılamadı, mock veriye geçiliyor.');

      let result = [...MOCK_MOVIES];

      if (genre && genre !== 'Tümü') {
        result = result.filter((m) =>
          m.genres.includes(genre as Genre)
        );
      }

      if (search && search.trim()) {
        const query = search.toLowerCase().trim();

        result = result.filter(
          (m) =>
            m.title.toLowerCase().includes(query) ||
            m.director.toLowerCase().includes(query) ||
            m.genres.some((g) =>
              g.toLowerCase().includes(query)
            )
        );
      }

      return result;
    }
  },

  /**
   * GET /api/movies/{id}
   */
  async getMovieById(id: number): Promise<Movie> {
    try {
      const response = await requestApi<BackendMovie>(
        `/movies/${id}`,
        'GET'
      );

      return mapBackendMovieToMovie(response);

    } catch (error: any) {
      const found = MOCK_MOVIES.find(
        (m) => m.id === Number(id)
      );

      if (!found) {
        throw new Error('Film bulunamadı.');
      }

      return found;
    }
  },

  /**
   * Backend'de /movies/featured endpoint'i henüz bulunmadığı için
   * mevcut /movies endpoint'i üzerinden öne çıkanlar belirleniyor.
   */
  async getFeaturedMovies(): Promise<Movie[]> {
    try {
      const response = await requestApi<BackendMovie[]>(
        '/movies',
        'GET'
      );

      const movies = response.map(mapBackendMovieToMovie);

      return movies.slice(0, 5);

    } catch {
      return MOCK_MOVIES.filter(
        (m) => m.isFeatured || m.rating >= 8.8
      ).slice(0, 5);
    }
  },
};