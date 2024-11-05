package com.example.together.dto.response;

import com.example.together.enumconfig.RelationshipStatus;
import com.example.together.model.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RelationshipResponse{
     Long id;
     UserResponse user2;
     RelationshipStatus status;
     LocalDateTime createdAt;
}
