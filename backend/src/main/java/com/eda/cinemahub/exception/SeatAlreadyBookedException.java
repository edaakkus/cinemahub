package com.eda.cinemahub.exception;

// Aynı seans + aynı koltuk için ikinci kez bilet kesilmeye çalışılırsa fırlatılır.
// "Bulunamadı" değil "çakışma" olduğu için ResourceNotFoundException'dan türetmiyoruz.
public class SeatAlreadyBookedException extends RuntimeException {
    public SeatAlreadyBookedException(Long showTimeId, Long seatId) {
        super("Seat " + seatId + " is already booked for showTime " + showTimeId);
    }
}