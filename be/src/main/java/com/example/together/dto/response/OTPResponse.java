package com.example.together.dto.response;

import com.example.together.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OTPResponse {
    private User user;
}
