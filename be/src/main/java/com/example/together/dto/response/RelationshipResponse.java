package com.example.together.dto.response;

import com.example.together.enumconfig.RelationshipStatus;
import com.example.together.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class RelationshipResponse{
    private Long id;
    private UserResponse user2;
//    private String userId;

    private RelationshipStatus status;
    private LocalDateTime createdAt;
}
