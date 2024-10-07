package com.example.together.controller;

import com.example.together.dto.request.OTPRequest;
import com.example.together.dto.response.ApiResponse;
import com.example.together.service.OTPService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/otp")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OTPController {
    OTPService otpService;

    @PostMapping("/send")
    ApiResponse<String> sendOTP(@RequestBody OTPRequest request) {
        return ApiResponse.<String>builder()
                .result(otpService.sendOTP(request.getEmail()))
                .build();
    }

    @PostMapping("/verify")
    ApiResponse<String> verifyOTP(@RequestBody OTPRequest request) {
        return ApiResponse.<String>builder()
                .result(otpService.verifyOTP(request.getOtp()))
                .build();
    }
}
