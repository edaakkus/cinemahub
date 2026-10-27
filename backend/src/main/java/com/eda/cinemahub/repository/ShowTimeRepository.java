package com.eda.cinemahub.repository;

import com.eda.cinemahub.entity.ShowTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShowTimeRepository extends JpaRepository<ShowTime, Long> {

    List<ShowTime> findByMovieId(Long movieId);

    List<ShowTime> findByHallId(Long hallId);
}