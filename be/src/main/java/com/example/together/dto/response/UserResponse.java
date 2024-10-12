package com.example.together.dto.response;

import com.example.together.model.Relationship;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String email;
    String username;
    LocalDate dob;
    Set<RelationshipResponse> friendshipsInitiated;
}
