package com.example.together.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GroupMessageResponse {
    String sender;
    Long group;
    String content;
    LocalDateTime sentAt;
}
