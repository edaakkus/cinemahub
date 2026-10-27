import React, { useState } from 'react';
import { X, Code2, Copy, Check, Terminal, FileCode } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SpringBootCodeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'controller' | 'dto' | 'curl'>('controller');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const codeSnippets = {
    controller: `package com.cinemahub.controller;

import com.cinemahub.dto.*;
import com.cinemahub.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*") // Mobile / Web Client Access
public class CinemaHubController {

    private final MovieService movieService;
    private final ShowtimeService showtimeService;
    private final BookingService bookingService;

    public CinemaHubController(MovieService movieService, ShowtimeService showtimeService, BookingService bookingService) {
        this.movieService = movieService;
        this.showtimeService = showtimeService;
        this.bookingService = bookingService;
    }

    // GET /api/v1/movies?genre={genre}&search={query}
    @GetMapping("/movies")
    public ResponseEntity<List<MovieDTO>> getMovies(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(movieService.findMovies(genre, search));
    }

    // GET /api/v1/movies/{id}
    @GetMapping("/movies/{id}")
    public ResponseEntity<MovieDTO> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }

    // GET /api/v1/showtimes?movieId={movieId}&date={date}
    @GetMapping("/showtimes")
    public ResponseEntity<List<ShowtimeDTO>> getShowtimes(
            @RequestParam Long movieId,
            @RequestParam(required = false) String date) {
        return ResponseEntity.ok(showtimeService.getShowtimes(movieId, date));
    }

    // POST /api/v1/bookings
    @PostMapping("/bookings")
    public ResponseEntity<TicketDTO> createBooking(@RequestBody CreateBookingRequest request) {
        TicketDTO ticket = bookingService.createBooking(request);
        return ResponseEntity.ok(ticket);
    }
}`,
    dto: `package com.cinemahub.dto;

import java.util.List;

// MovieDTO.java
public record MovieDTO(
    Long id,
    String title,
    String originalTitle,
    String synopsis,
    Integer durationMinutes,
    Double rating,
    Integer voteCount,
    List<String> genres,
    String posterUrl,
    String backdropUrl,
    String releaseDate,
    String director,
    String ageRating,
    String language
) {}

// CreateBookingRequest.java
public record CreateBookingRequest(
    Long showtimeId,
    List<String> seatNumbers,
    String ticketType, // ADULT, STUDENT
    List<SnackRequest> snacks,
    String paymentMethod
) {}

public record SnackRequest(
    Long snackId,
    Integer quantity
) {}

// TicketDTO.java
public record TicketDTO(
    Long id,
    String pnrCode,
    Long userId,
    String movieTitle,
    String posterUrl,
    String hallName,
    String showtimeDate,
    String showtimeHour,
    String format,
    List<String> seats,
    Double totalAmount,
    String qrCodeUrl,
    String status // ACTIVE, USED, CANCELLED
) {}`,
    curl: `# 1. Film Listesini Getir (GET /api/v1/movies)
curl -X GET "http://localhost:8080/api/v1/movies?genre=Bilim%20Kurgu" \\
  -H "Accept: application/json"

# 2. Seansları Getir (GET /api/v1/showtimes)
curl -X GET "http://localhost:8080/api/v1/showtimes?movieId=101&date=2026-08-04" \\
  -H "Accept: application/json"

# 3. Bilet/Koltuk Rezerve Et (POST /api/v1/bookings)
curl -X POST "http://localhost:8080/api/v1/bookings" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "showtimeId": 201,
    "seatNumbers": ["D-5", "D-6"],
    "ticketType": "ADULT",
    "snacks": [{"snackId": 1, "quantity": 1}],
    "paymentMethod": "CREDIT_CARD"
  }'`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 text-slate-100 shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Spring Boot Mimarisi & Kod Şablonları</h3>
            <p className="text-xs text-slate-400">cinema-hub REST API Controller ve DTO katmanları</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4 shrink-0">
          <button
            onClick={() => setActiveTab('controller')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'controller'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Spring Controller (.java)
          </button>
          <button
            onClick={() => setActiveTab('dto')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'dto'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            DTO Records (.java)
          </button>
          <button
            onClick={() => setActiveTab('curl')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'curl'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            cURL Örnekleri
          </button>

          <button
            onClick={handleCopy}
            className="ml-auto px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Kopyala</span>
              </>
            )}
          </button>
        </div>

        {/* Code Container */}
        <div className="flex-1 overflow-y-auto bg-slate-950 border border-slate-800/80 rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
          <pre className="whitespace-pre-wrap">{codeSnippets[activeTab]}</pre>
        </div>

        <div className="mt-4 shrink-0 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
          <span>Spring Boot 3.x + Java 17/21 DTO Record Uyumlu</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
