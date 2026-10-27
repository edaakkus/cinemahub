package com.eda.cinemahub.config;

import com.eda.cinemahub.entity.*;
import com.eda.cinemahub.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final HallRepository hallRepository;
    private final SeatRepository seatRepository;
    private final ShowTimeRepository showTimeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           MovieRepository movieRepository,
                           HallRepository hallRepository,
                           SeatRepository seatRepository,
                           ShowTimeRepository showTimeRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.hallRepository = hallRepository;
        this.seatRepository = seatRepository;
        this.showTimeRepository = showTimeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        initUsers();
        Hall hall1 = initHalls();
        List<Movie> movies = initMovies();
        initShowTimes(movies, hall1);
        logger.info("CinemaHub başlangıç verileri başarıyla yüklendi.");
    }

    private void initUsers() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                    "admin",
                    "admin@cinemahub.com",
                    passwordEncoder.encode("admin123"),
                    Role.ADMIN
            );
            userRepository.save(admin);
            logger.info("Admin kullanıcısı oluşturuldu: admin / admin123");
        }

        if (!userRepository.existsByUsername("eda")) {
            User eda = new User(
                    "eda",
                    "eda@cinemahub.com",
                    passwordEncoder.encode("123456"),
                    Role.USER
            );
            userRepository.save(eda);
            logger.info("Demo kullanıcısı oluşturuldu: eda / 123456");
        }
    }

    private Hall initHalls() {
        if (hallRepository.count() == 0) {
            Hall hall1 = new Hall();
            hall1.setName("Salon 1 - IMAX");
            hall1.setCapacity(64);
            hall1 = hallRepository.save(hall1);

            Hall hall2 = new Hall();
            hall2.setName("Salon 2 - VIP Lounge");
            hall2.setCapacity(40);
            hallRepository.save(hall2);

            // Koltukları oluştur (Salon 1: 8 sıra x 8 koltuk = 64)
            List<Seat> seats = new ArrayList<>();
            for (int r = 1; r <= 8; r++) {
                for (int s = 1; s <= 8; s++) {
                    Seat seat = new Seat(r, s, hall1);
                    seats.add(seat);
                }
            }
            seatRepository.saveAll(seats);

            // Salon 2: 5 sıra x 8 koltuk = 40
            List<Seat> seats2 = new ArrayList<>();
            for (int r = 1; r <= 5; r++) {
                for (int s = 1; s <= 8; s++) {
                    Seat seat = new Seat(r, s, hall2);
                    seats2.add(seat);
                }
            }
            seatRepository.saveAll(seats2);

            logger.info("Salonlar ve koltuklar oluşturuldu.");
            return hall1;
        }
        return hallRepository.findAll().get(0);
    }

    private List<Movie> initMovies() {
        if (movieRepository.count() == 0) {
            List<Movie> list = List.of(
                    new Movie(
                            "Dune: Çöl Gezegeni Bölüm İki",
                            "Bilim Kurgu",
                            166,
                            2024,
                            "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
                            "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5200SV.jpg",
                            "Paul Atreides, ailesini yok eden komploculara karşı bir intikam savaşı başlatırken Chani ve Fremen'lerle birleşiyor.",
                            8.6,
                            "Denis Villeneuve",
                            "13+",
                            "https://www.youtube.com/watch?v=Way9Dexny3w"
                    ),
                    new Movie(
                            "Oppenheimer",
                            "Dram",
                            180,
                            2023,
                            "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
                            "https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
                            "Amerikalı bilim insanı J. Robert Oppenheimer ve Manhattan Projesi'ndeki rolünün biyografik hikayesi.",
                            8.9,
                            "Christopher Nolan",
                            "16+",
                            "https://www.youtube.com/watch?v=uYPbbksJxIg"
                    ),
                    new Movie(
                            "Spider-Man: Örümcek Evrenine Geçiş",
                            "Animasyon",
                            140,
                            2023,
                            "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
                            "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
                            "Miles Morales, Çoklu Evren boyunca fırlatılır ve burada onun varlığını korumakla görevli Örümcek-İnsanlar ekibiyle karşılaşır.",
                            8.7,
                            "Joaquim Dos Santos",
                            "Genel İzleyici",
                            "https://www.youtube.com/watch?v=cqGjhVJWtEg"
                    ),
                    new Movie(
                            "Interstellar",
                            "Bilim Kurgu",
                            169,
                            2014,
                            "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
                            "https://image.tmdb.org/t/p/original/rAiYTsqJJq0AhHggLbgti95HQ8O.jpg",
                            "İnsanlığın geleceğinin tehlikede olduğu bir dönemde, bir grup kaşif solucan deliğinden geçerek yaşanabilir yeni bir gezegen arar.",
                            8.7,
                            "Christopher Nolan",
                            "Genel İzleyici",
                            "https://www.youtube.com/watch?v=zSWdZVtXT7E"
                    ),
                    new Movie(
                            "Gladyatör II",
                            "Aksiyon",
                            148,
                            2024,
                            "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
                            "https://image.tmdb.org/t/p/original/euYIwmwkmz95mnXvufEmbL69nvq.jpg",
                            "Maximus'un ölümünün ardından Lucius, zalim imparatorların yönettiği Roma Kolezyumu'na girmek zorunda kalır.",
                            7.2,
                            "Ridley Scott",
                            "16+",
                            "https://www.youtube.com/watch?v=4rgYUipGJNo"
                    )
            );
            List<Movie> saved = movieRepository.saveAll(list);
            logger.info("Popüler filmler veritabanına eklendi.");
            return saved;
        }
        return movieRepository.findAll();
    }

    private void initShowTimes(List<Movie> movies, Hall hall) {
        if (showTimeRepository.count() == 0 && !movies.isEmpty() && hall != null) {
            List<ShowTime> showTimes = new ArrayList<>();
            LocalDateTime now = LocalDateTime.now();

            for (Movie movie : movies) {
                // Bugün için 2 seans
                showTimes.add(new ShowTime(
                        movie,
                        hall,
                        now.withHour(14).withMinute(30).withSecond(0),
                        new BigDecimal("220.00")
                ));
                showTimes.add(new ShowTime(
                        movie,
                        hall,
                        now.withHour(19).withMinute(0).withSecond(0),
                        new BigDecimal("250.00")
                ));
                // Yarın için 2 seans
                showTimes.add(new ShowTime(
                        movie,
                        hall,
                        now.plusDays(1).withHour(16).withMinute(0).withSecond(0),
                        new BigDecimal("220.00")
                ));
                showTimes.add(new ShowTime(
                        movie,
                        hall,
                        now.plusDays(1).withHour(21).withMinute(15).withSecond(0),
                        new BigDecimal("250.00")
                ));
            }
            showTimeRepository.saveAll(showTimes);
            logger.info("Örnek seanslar veritabanına eklendi.");
        }
    }
}
