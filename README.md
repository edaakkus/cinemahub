# 🎬 CinemaHub - Full-Stack Sinema Bilet & Rezervasyon Platformu

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.4-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![React](https://img.shields.io/badge/React-19.0.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Stateless_Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

**CinemaHub**, sinema salonlarının ve film seanslarının yönetildiği, kullanıcıların vizyondaki ve gelecek filmleri inceleyip interaktif koltuk şeması üzerinden bilet satın alabildiği tam kapsamlı (**Full-Stack**) bir sinema rezervasyon otomasyonudur.

---

## ✨ Temel Özellikler

### 📱 Kullanıcı Arayüzü (Frontend - React 19 & Tailwind CSS v4)
* **Mobil Öncelikli & Sinematik Tasarım:** Karanlık mod (Dark theme), cam efekti (glassmorphism) ve akıcı mikro animasyonlar.
* **Film Kataloğu & Filtreleme:** Türe göre filtreleme (Bilim Kurgu, Dram, Aksiyon vb.), anlık arama, vizyondakiler ve yakındakiler listeleri.
* **Film Detay Sayfası:** Büyük afiş, sinopsis, yönetmen, oyuncular, süre, yaş sınırı ve seans tarih/saat seçimi.
* **İnteraktif Koltuk Seçimi:** Sinema perdesi simülasyonu, standart ve VIP koltuk kategorileri, dolu ve seçili koltuk renk ayrımları.
* **Büfe / Snack Menüsü:** Bilet satın alırken mısır, içecek ve atıştırmalık ekleme seçeneği.
* **Dijital Biletlerim:** QR kodlu bilet kartları, PNR kodu, salon/seans bilgileri ve anında bilet iptal edebilme.
* **Kullanıcı Profili & Kimlik Doğrulama:** JWT tabanlı giriş, kayıt olma ve profil yönetimi.

### 🛡️ RESTful API Servisi (Backend - Spring Boot 3 & Java 21)
* **Katmanlı Mimari (Layered Architecture):** Controller, Service, Repository, DTO ve Entity ayrımı.
* **Spring Security & JWT:** Stateless kimlik doğrulama, BCrypt ile şifrelenmiş parolalar ve rol bazlı yetkilendirme (`ROLE_USER`, `ROLE_ADMIN`).
* **İş Kuralları (Business Rules):** Aynı seans ve aynı koltuk için mükerrer bilet alınmasını engelleyen özel kural (`SeatAlreadyBookedException`).
* **Veritabanı Başlangıç Tohumu (DataInitializer):** Uygulama ilk kez ayağa kalktığında otomatik olarak örnek admin, kullanıcı, salonlar, koltuklar ve afişli vizyon filmleri yüklenir.
* **Swagger / OpenAPI Dokümantasyonu:** Tüm REST API uç noktaları için interaktif test arayüzü (`/swagger-ui/index.html`).

---

## 🏛️ Mimari Yapı

```
cinemahub/
├── backend/                       # Spring Boot 3 + Java 21 REST API
│   ├── src/main/java/com/eda/cinemahub/
│   │   ├── config/                # Security, CORS, OpenAPI & DataInitializer
│   │   ├── controller/            # Auth, Movie, ShowTime, Seat, Hall, Ticket API
│   │   ├── dto/                   # Request & Response DTO Modelleri
│   │   ├── entity/                # JPA Entity'leri (User, Movie, Hall, Seat, ShowTime, Ticket)
│   │   ├── exception/             # GlobalExceptionHandler & Özel Hata Sınıfları
│   │   ├── repository/            # Spring Data JPA Arayüzleri
│   │   ├── security/              # JWT Filter ve Token Servisi
│   │   └── service/               # İş Mantığı (Business Logic) Katmanı
│   └── src/main/resources/
│       └── application.properties # Veritabanı ve JWT ayarları
│
└── frontend/                      # React 19 + TypeScript + Vite İstemcisi
    ├── src/
    │   ├── components/            # UI Bileşenleri (Auth, Booking, Movies, Tickets, Common)
    │   ├── services/              # Backend API İstemcisi (apiClient, auth, movie, booking)
    │   ├── types/                 # TypeScript Veri Tipleri
    │   └── App.tsx                # Ana Uygulama & Ekran Yönlendirmeleri
    └── package.json
```

---

## 🚀 Kurulum ve Çalıştırma

### 1. Gereksinimler
* **Java 21** veya üzeri
* **Node.js** (v18+) ve **npm**
* **MySQL** Server (Yerel veya Docker)

---

### 2. Backend Kurulumu

1. `backend/src/main/resources/application.properties` dosyasındaki veritabanı bilgilerinizi kontrol edin:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/cinemahub?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   ```
2. Backend dizinine gidin ve uygulamayı başlatın:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
3. Uygulama `http://localhost:8080` portunda açılacaktır.
4. **Swagger UI Dokümantasyonu:**  
   Tarayıcınızdan `http://localhost:8080/swagger-ui/index.html` adresine giderek tüm API'ları test edebilirsiniz.

> **Hazır Kullanıcı Hesapları (Otomatik Yüklenir):**
> * **Admin:** `admin` / `admin123`
> * **Kullanıcı:** `eda` / `123456`

---

### 3. Frontend Kurulumu

1. Frontend dizinine gidin:
   ```bash
   cd frontend
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
4. Tarayıcınızda açın:  
   👉 `http://localhost:3000`

---

## 📡 Temel API Uç Noktaları

| Metot | Uç Nokta | Açıklama | Yetki |
|---|---|---|---|
| `POST` | `/api/auth/register` | Yeni kullanıcı kaydı | Herkese Açık |
| `POST` | `/api/auth/login` | Giriş yapıp JWT token alma | Herkese Açık |
| `GET` | `/api/auth/me` | Aktif kullanıcının profil bilgileri | Kullanıcı/Admin |
| `GET` | `/api/movies` | Tüm filmleri listeleme (arama & tür filtreli) | Herkese Açık |
| `GET` | `/api/movies/{id}` | Film detaylarını getirme | Herkese Açık |
| `GET` | `/api/showtimes` | Seansları listeleme (`?movieId=` filtreli) | Herkese Açık |
| `GET` | `/api/seats` | Koltukları listeleme (`?hallId=` filtreli) | Herkese Açık |
| `GET` | `/api/tickets/occupied-seats/{showTimeId}` | Seanstaki dolu koltuk ID'lerini getirme | Herkese Açık |
| `POST` | `/api/tickets` | Bilet satın alma | Giriş Zorunlu |
| `GET` | `/api/tickets/my-tickets` | Kullanıcının satın aldığı biletler | Giriş Zorunlu |
| `DELETE` | `/api/tickets/{id}` | Bilet iptal etme | Giriş Zorunlu |

---

## 👩‍💻 Geliştirici

* **Eda Akkuş** - [GitHub Profiliniz](https://github.com/)
