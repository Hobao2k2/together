package com.example.together.dto.request;

import com.example.together.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OTPCreationRequest {
    private String otp;
    private User user;
}
