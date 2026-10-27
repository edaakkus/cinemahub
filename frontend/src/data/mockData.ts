import { Movie, Showtime, SnackItem, Ticket, User } from '../types';

export const INITIAL_USER: User = {
  id: 1,
  fullName: 'Arda Yılmaz',
  email: 'arda.yilmaz@cinemahub.com',
  phone: '+90 532 123 4567',
  role: 'USER',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
  createdAt: '2025-01-15'
};

export const MOCK_MOVIES: Movie[] = [
  {
    id: 101,
    title: 'Dune: Çöl Gezegeni Bölüm İki',
    originalTitle: 'Dune: Part Two',
    synopsis: 'Paul Atreides, Chani ve Fremenlerle birleşerek ailesini yok eden komplo kurucularından intikam alma yolculuğuna başlar. Hayatının aşkı ile bilinen evrenin kaderi arasında seçim yapmak zorunda kalan Paul, yalnızca kendisinin öngörebileceği korkunç bir geleceği engellemeye çalışır.',
    durationMinutes: 166,
    rating: 8.9,
    voteCount: 421500,
    genres: ['Bilim Kurgu', 'Macera', 'Aksiyon'],
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1200',
    releaseDate: '2024-03-01',
    director: 'Denis Villeneuve',
    cast: [
      { name: 'Timothée Chalamet', roleName: 'Paul Atreides' },
      { name: 'Zendaya', roleName: 'Chani' },
      { name: 'Rebecca Ferguson', roleName: 'Lady Jessica' },
      { name: 'Austin Butler', roleName: 'Feyd-Rautha Harkonnen' }
    ],
    ageRating: '13+',
    language: 'Türkçe Altyazılı & Dublaj',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    isFeatured: true,
    isNowShowing: true,
  },
  {
    id: 102,
    title: 'Oppenheimer',
    originalTitle: 'Oppenheimer',
    synopsis: 'Amerikalı bilim insanı J. Robert Oppenheimer\'ın hayatı ve Manhattan Projesi kapsamında atom bombasını geliştirme sürecindeki rolü sürükleyici bir dramla beyaz perdeye taşınıyor.',
    durationMinutes: 180,
    rating: 8.9,
    voteCount: 780000,
    genres: ['Dram', 'Gerilim'],
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=800',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
    releaseDate: '2023-07-21',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Cillian Murphy', roleName: 'J. Robert Oppenheimer' },
      { name: 'Emily Blunt', roleName: 'Katherine Oppenheimer' },
      { name: 'Matt Damon', roleName: 'Leslie Groves' },
      { name: 'Robert Downey Jr.', roleName: 'Lewis Strauss' }
    ],
    ageRating: '16+',
    language: 'Türkçe Altyazılı',
    isFeatured: true,
    isNowShowing: true,
  },
  {
    id: 103,
    title: 'Interstellar: Yıldızlararası',
    originalTitle: 'Interstellar',
    synopsis: 'İnsanlığın Dünya üzerindeki son günlerinde bir grup kaşif, insanlığın hayatta kalmasını sağlamak için solucan deliğinden geçerek evrende yeni bir yaşanabilir gezegen arayışına girer.',
    durationMinutes: 169,
    rating: 8.7,
    voteCount: 2100000,
    genres: ['Bilim Kurgu', 'Dram', 'Macera'],
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200',
    releaseDate: '2014-11-07',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Matthew McConaughey', roleName: 'Cooper' },
      { name: 'Anne Hathaway', roleName: 'Brand' },
      { name: 'Jessica Chastain', roleName: 'Murph' }
    ],
    ageRating: '13+',
    language: 'IMAX Türkçe Altyazılı',
    isNowShowing: true,
  },
  {
    id: 104,
    title: 'Ters Yüz 2',
    originalTitle: 'Inside Out 2',
    synopsis: 'Riley genç kızlık dönemine adım atarken zihnindeki kumanda merkezinde beklenmedik bir tadilat başlar: Yeni duygulara yer açmak! Kaygı, Gıpta, Bıkkınlık ve Utanç kumandayı ele geçirince Neşe ve diğerleri ne yapacağını şaşırır.',
    durationMinutes: 96,
    rating: 8.4,
    voteCount: 245000,
    genres: ['Animasyon', 'Komedi', 'Macera'],
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800',
    backdropUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1200',
    releaseDate: '2024-06-14',
    director: 'Kelsey Mann',
    cast: [
      { name: 'Amy Poehler', roleName: 'Joy (Neşe)' },
      { name: 'Maya Hawke', roleName: 'Anxiety (Kaygı)' },
      { name: 'Kensington Tallman', roleName: 'Riley' }
    ],
    ageRating: 'Genel İzleyici',
    language: 'Türkçe Dublaj',
    isNowShowing: true,
  },
  {
    id: 105,
    title: 'Joker: İki Kişilik Çılgınlık',
    originalTitle: 'Joker: Folie à Deux',
    synopsis: 'Arthur Fleck, Arkham Tımarhanesi\'nde işlediği suçlardan ötürü yargılanmayı beklerken gerçek aşkıyla ve içindeki müziği keşfetmesiyle yepyeni bir psikolojik boyuta geçer.',
    durationMinutes: 138,
    rating: 7.9,
    voteCount: 189000,
    genres: ['Dram', 'Gerilim', 'Romantik'],
    posterUrl: 'https://images.unsplash.com/photo-1568876694728-451bbf694b83?auto=format&fit=crop&q=80&w=800',
    backdropUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200',
    releaseDate: '2024-10-04',
    director: 'Todd Phillips',
    cast: [
      { name: 'Joaquin Phoenix', roleName: 'Arthur Fleck / Joker' },
      { name: 'Lady Gaga', roleName: 'Lee Quinzel / Harley Quinn' }
    ],
    ageRating: '18+',
    language: 'Türkçe Altyazılı',
    isUpcoming: true,
  },
  {
    id: 106,
    title: 'Avatar: Ateş ve Kül',
    originalTitle: 'Avatar: Fire and Ash',
    synopsis: 'Jake Sully ve Neytiri, Pandora\'nın volkanik bölgelerinde yaşayan saldırgan ve gizemli Ateş Kabilesi ile karşı karşıya gelir.',
    durationMinutes: 195,
    rating: 9.1,
    voteCount: 50000,
    genres: ['Bilim Kurgu', 'Macera', 'Fantastik'],
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    backdropUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    releaseDate: '2025-12-19',
    director: 'James Cameron',
    cast: [
      { name: 'Sam Worthington', roleName: 'Jake Sully' },
      { name: 'Zoe Saldaña', roleName: 'Neytiri' },
      { name: 'Sigourney Weaver', roleName: 'Kiri' }
    ],
    ageRating: '13+',
    language: 'IMAX 3D Türkçe Altyazılı',
    isUpcoming: true,
  }
];

export const MOCK_SHOWTIMES: Showtime[] = [
  // Dune Part Two showtimes
  {
    id: 201,
    movieId: 101,
    cinemaHall: { id: 1, name: 'Salon 1 - IMAX Laser', totalRows: 8, seatsPerRow: 10 },
    startTime: '13:00',
    date: new Date().toISOString().split('T')[0],
    format: 'IMAX 3D',
    priceStandard: 220,
    priceVip: 300,
    priceStudent: 170,
    languageType: 'Altyazılı'
  },
  {
    id: 202,
    movieId: 101,
    cinemaHall: { id: 1, name: 'Salon 1 - IMAX Laser', totalRows: 8, seatsPerRow: 10 },
    startTime: '16:30',
    date: new Date().toISOString().split('T')[0],
    format: 'IMAX 3D',
    priceStandard: 220,
    priceVip: 300,
    priceStudent: 170,
    languageType: 'Altyazılı'
  },
  {
    id: 203,
    movieId: 101,
    cinemaHall: { id: 2, name: 'Salon 3 - Dolby Atmos', totalRows: 7, seatsPerRow: 8 },
    startTime: '20:00',
    date: new Date().toISOString().split('T')[0],
    format: '2D',
    priceStandard: 180,
    priceVip: 240,
    priceStudent: 140,
    languageType: 'Dublaj'
  },
  // Oppenheimer showtimes
  {
    id: 204,
    movieId: 102,
    cinemaHall: { id: 3, name: 'Salon 2 - VIP Lounge', totalRows: 6, seatsPerRow: 8 },
    startTime: '14:15',
    date: new Date().toISOString().split('T')[0],
    format: 'VIP Lounge',
    priceStandard: 250,
    priceVip: 350,
    priceStudent: 210,
    languageType: 'Altyazılı'
  },
  {
    id: 205,
    movieId: 102,
    cinemaHall: { id: 1, name: 'Salon 1 - IMAX Laser', totalRows: 8, seatsPerRow: 10 },
    startTime: '21:15',
    date: new Date().toISOString().split('T')[0],
    format: 'IMAX 3D',
    priceStandard: 220,
    priceVip: 300,
    priceStudent: 170,
    languageType: 'Altyazılı'
  },
  // Interstellar
  {
    id: 206,
    movieId: 103,
    cinemaHall: { id: 2, name: 'Salon 3 - Dolby Atmos', totalRows: 7, seatsPerRow: 8 },
    startTime: '17:00',
    date: new Date().toISOString().split('T')[0],
    format: 'Dolby Atmos',
    priceStandard: 190,
    priceVip: 260,
    priceStudent: 150,
    languageType: 'Altyazılı'
  },
  // Inside Out 2
  {
    id: 207,
    movieId: 104,
    cinemaHall: { id: 4, name: 'Salon 5 - Standart', totalRows: 8, seatsPerRow: 10 },
    startTime: '11:30',
    date: new Date().toISOString().split('T')[0],
    format: '2D',
    priceStandard: 160,
    priceVip: 210,
    priceStudent: 120,
    languageType: 'Dublaj'
  },
  {
    id: 208,
    movieId: 104,
    cinemaHall: { id: 4, name: 'Salon 5 - Standart', totalRows: 8, seatsPerRow: 10 },
    startTime: '15:00',
    date: new Date().toISOString().split('T')[0],
    format: '3D',
    priceStandard: 180,
    priceVip: 230,
    priceStudent: 140,
    languageType: 'Dublaj'
  }
];

export const MOCK_SNACKS: SnackItem[] = [
  {
    id: 1,
    name: 'Büyük Mısır + İçecek Menü',
    description: '1x Büyük Boy Tuzlu Popcorn & 1x 1L Soğuk İçecek',
    price: 135,
    category: 'Menü',
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 2,
    name: 'Sevgili Menüsü',
    description: '1x Mega Popcorn (Karamel/Peynir) & 2x İçecek & Çikolata',
    price: 240,
    category: 'Menü',
    imageUrl: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 3,
    name: 'Karamelli Popcorn (Orta)',
    description: 'Taze pişmiş tatlı karamel kaplı popcorn',
    price: 90,
    category: 'Popcorn',
    imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 4,
    name: 'Nacho & Peynir Soslu Menü',
    description: 'Meksika cipsi, sıcak cheddar sos ve orta boy içecek',
    price: 150,
    category: 'Atıştırmalık',
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=300'
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 9001,
    pnrCode: 'CH-774912',
    userId: 1,
    movieTitle: 'Dune: Çöl Gezegeni Bölüm İki',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
    hallName: 'Salon 1 - IMAX Laser',
    showtimeDate: new Date().toISOString().split('T')[0],
    showtimeHour: '20:00',
    format: 'IMAX 3D',
    seats: ['D-5', 'D-6'],
    snacks: [
      { snackId: 1, snackName: 'Büyük Mısır + İçecek Menü', quantity: 1, unitPrice: 135 }
    ],
    totalAmount: 575,
    bookingDate: '2025-02-01 14:22',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PNR-CH-774912-DUNE2',
    status: 'ACTIVE'
  },
  {
    id: 9002,
    pnrCode: 'CH-610293',
    userId: 1,
    movieTitle: 'Oppenheimer',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=800',
    hallName: 'Salon 2 - VIP Lounge',
    showtimeDate: '2025-01-20',
    showtimeHour: '19:30',
    format: 'VIP Lounge',
    seats: ['B-3'],
    totalAmount: 350,
    bookingDate: '2025-01-19 18:45',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PNR-CH-610293-OPPEN',
    status: 'USED'
  }
];
