package com.example.together.dto.request;

import com.example.together.model.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GroupCreationRequest {
    String name;
    User createdBy;
}
