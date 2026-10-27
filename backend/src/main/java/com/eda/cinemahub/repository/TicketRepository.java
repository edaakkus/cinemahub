package com.eda.cinemahub.repository;

import com.eda.cinemahub.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    boolean existsByShowTimeIdAndSeatId(Long showTimeId, Long seatId);

    List<Ticket> findByShowTimeId(Long showTimeId);

    List<Ticket> findByUserId(Long userId);

    List<Ticket> findByUserUsername(String username);
}