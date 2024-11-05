package com.example.together.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GroupChatResponse {
    Long id;
    String name;
    String createdBy;
    LocalDateTime createdAt;
}
