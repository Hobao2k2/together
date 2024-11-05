package com.example.together.dto.response;

import com.example.together.model.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PrivateMessageResponse {

     String sender;
     String receiver;
     String content;
     LocalDateTime sentAt;

}
