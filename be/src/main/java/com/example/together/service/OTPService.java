package com.example.together.service;

import com.example.together.dto.request.OTPRequest;
import com.example.together.dto.response.UserResponse;
import com.example.together.exception.AppException;
import com.example.together.exception.ErrorCode;
import com.example.together.model.OTP;
import com.example.together.model.User;
import com.example.together.repository.OTPRepository;
import com.example.together.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OTPService {
    OTPRepository otpRepository;
    UserRepository userRepository;
    JavaMailSender mailSender;

    public String sendOTP(String email){
        var user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        String otp=String.format("%06d", new Random().nextInt(999999));
        OTP otpEntity=OTP.builder().otp(otp).user(user).expiryDate(LocalDateTime.now().plusMinutes(5)).build();
        otpRepository.save(otpEntity);
        OTPRequest otpRequest=new OTPRequest(email,otp);
        sendOTPEmail(otpRequest);
        return "da gui otp";
    }

    public String verifyOTP(String otpRequest){
        var otp = otpRepository.findByOtp(otpRequest)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_OTP));
        if (otp.getExpiryDate().isAfter(LocalDateTime.now())) {
            var userId = otp.getUser().getId();
            delete(otp.getId());
            return userId;
        } else {
            delete(otp.getId());
            throw new AppException(ErrorCode.OTP_EXPIRED);
        }

    }

    private void sendOTPEmail(OTPRequest request){
        SimpleMailMessage simpleMailMessage=new SimpleMailMessage();
        simpleMailMessage.setTo(request.getEmail());
        simpleMailMessage.setSubject("Together send OTP Code ");
        simpleMailMessage.setText("Your OTP code is: " + request.getOtp() + ". It will expire in 5 minutes.");
        mailSender.send(simpleMailMessage);
    }

    private void delete(Long id){
        otpRepository.deleteById(id);
    }

}
