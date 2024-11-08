package com.example.together.service;

import com.example.together.dto.response.PrivateMessageResponse;
import com.example.together.exception.AppException;
import com.example.together.exception.ErrorCode;
import com.example.together.mapper.PrivateMessageMapper;
import com.example.together.model.PrivateMessage;
import com.example.together.model.User;
import com.example.together.repository.PrivateMessageRepository;
import com.example.together.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PrivateMessageService {
    PrivateMessageRepository privateMessageRepository;
    UserRepository userRepository;
    PrivateMessageMapper privateMessageMapper;

    public void createPrivateMessage(PrivateMessage privateMessage){
        privateMessage.setSentAt(LocalDateTime.now());
        privateMessageRepository.save(privateMessage);
    }

    public List<PrivateMessageResponse> getAllPrivateMessage(){
        return privateMessageRepository.findAll().stream().map(privateMessageMapper::toPrivateMessageResponse).toList();
    }

    public List<PrivateMessageResponse> getSenderMessage(String userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));
        return privateMessageRepository.findBySender(user).stream().map(privateMessageMapper::toPrivateMessageResponse).toList();
    }


    public List<PrivateMessageResponse> getSenderMessageToKey(String senderId, String receiverId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));

        return privateMessageRepository.findBySenderAndReceiverAndContentContainingIgnoreCase(sender, receiver, content)
                .stream()
                .map(privateMessageMapper::toPrivateMessageResponse)
                .toList();
    }

    public Page<PrivateMessageResponse> getSenderMessageToUserId(String senderId, String receiverId, int page, int size) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));

        PageRequest pageRequest = PageRequest.of(page, size);
        return privateMessageRepository.findBySenderAndReceiver(sender, receiver, pageRequest)
                .map(privateMessageMapper::toPrivateMessageResponse);
    }
}
