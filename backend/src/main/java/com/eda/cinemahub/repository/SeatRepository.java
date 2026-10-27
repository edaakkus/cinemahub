package com.eda.cinemahub.repository;

import com.eda.cinemahub.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    // Spring Data JPA, metod ismini okuyarak SQL sorgusunu kendisi üretir:
    // "SELECT * FROM seats WHERE hall_id = ?" — hiçbir implementasyon yazmadan çalışır.
    List<Seat> findByHallId(Long hallId);
}