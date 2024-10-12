package com.example.together.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String email;
    private String username;
    private String password;
    private LocalDate dob;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OTP> otps = new ArrayList<>();

    @OneToMany(mappedBy = "user1",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private Set<Relationship> friendshipsInitiated = new HashSet<>();

    @OneToMany(mappedBy = "user2",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private Set<Relationship> friendshipsReceived = new HashSet<>();
}
