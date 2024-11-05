package com.example.together.repository;

import com.example.together.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,String> {
    boolean existsByEmail(String email);

    boolean existsById(String id);

    Optional<User> findById(String id);
    Optional<User> findByEmail(String email);
}
