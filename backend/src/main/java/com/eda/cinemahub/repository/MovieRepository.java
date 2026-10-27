package com.eda.cinemahub.repository;

import com.eda.cinemahub.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// JpaRepository<Entity, ID tipi> miras alınarak
// save(), findAll(), findById(), deleteById() gibi metodlar
// hiçbir implementasyon yazılmadan otomatik olarak kazanılır.
// Spring, arka planda bu interface için çalışma zamanında
// (runtime) bir proxy sınıf üretir; biz sadece interface tanımlarız.

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
}