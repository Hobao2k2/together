package com.example.together.dto.request;

import com.example.together.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupChatCreationRequest {
    private String name;
    private String createdById;
    private LocalDateTime createdAt;
}
