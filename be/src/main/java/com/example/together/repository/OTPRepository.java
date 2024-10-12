package com.example.together.repository;

import com.example.together.model.OTP;
import com.example.together.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OTPRepository extends JpaRepository<OTP, Long> {
    Optional<OTP> findByOtp(String OTP);
    Optional<OTP> findFirstByUserAndIsUsedFalseOrderByExpiryDateDesc(User user);

    boolean existsByOtpAndIsUsedTrue(String otp);
}
