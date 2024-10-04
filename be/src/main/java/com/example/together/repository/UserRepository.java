package com.example.together.repository;

import com.example.together.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User,String> {
    boolean existsByUsername(String username);
    Optional<User> findByEmail(String email);
}
