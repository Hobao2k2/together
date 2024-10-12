package com.example.together.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class OTP {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String otp;
    private Boolean isUsed;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    private LocalDateTime expiryDate;
    private LocalDateTime createAt;

}
