package com.example.together.service;

import com.example.together.dto.response.UserResponse;
import com.example.together.enumconfig.RelationshipStatus;
import com.example.together.exception.AppException;
import com.example.together.exception.ErrorCode;
import com.example.together.model.Relationship;
import com.example.together.model.User;
import com.example.together.repository.RelationshipRepository;
import com.example.together.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RelationshipService {
    RelationshipRepository relationshipRepository;
    UserRepository userRepository;

    public String sendFriendRequest(String senderId, String receiverId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));
        Relationship relationshipCheck = relationshipRepository.findByUser1AndUser2AndStatus(sender, receiver, RelationshipStatus.PENDING)
                .orElseThrow(() -> new RuntimeException("Relationship not found"));
        if(relationshipCheck!=null){
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
        Relationship relationship = Relationship.builder()
                .user1(sender)
                .user2(receiver)
                .status(RelationshipStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
        relationshipRepository.save(relationship);
        return "Friend request sent";
    }

    public String acceptFriendRequest(String senderId, String receiverId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));

        Relationship relationship = relationshipRepository.findByUser1AndUser2AndStatus(sender, receiver, RelationshipStatus.PENDING)
                .orElseThrow(() -> new RuntimeException("Relationship not found"));
        relationship.setStatus(RelationshipStatus.ACCEPTED);
        relationship.setCreatedAt(LocalDateTime.now());
        relationshipRepository.save(relationship);
        return "Friend request accepted";
    }


    public String blockUser(String userId,String blockUserId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));
        User blockUser = userRepository.findById(blockUserId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));
        Relationship relationship= Relationship.builder()
                .user1(user)
                .user2(blockUser)
                .status(RelationshipStatus.BLOCKED)
                .createdAt(LocalDateTime.now())
                .build();
        relationshipRepository.save(relationship);
        return "User blocked";
    }

    public String unfriend(String senderId, String receiverId){
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));

        Relationship relationship = relationshipRepository.findByUser1AndUser2AndStatus(sender, receiver, RelationshipStatus.ACCEPTED)
                .orElseThrow(() -> new RuntimeException("Relationship not found"));
        relationshipRepository.deleteById(relationship.getId());
        return "Unfriended successfully";
    }

    public String rejectFriendRequest(String senderId, String receiverId){
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));

        Relationship relationship = relationshipRepository.findByUser1AndUser2AndStatus(receiver, sender, RelationshipStatus.PENDING)
                .orElseThrow(() -> new RuntimeException("Relationship not found"));
        relationshipRepository.deleteById(relationship.getId());
        return "Reject successfully";
    }

    public List<String> getSendFriendRequest(String userId) { //trả về danh sách id người mà bạn đã gửi lời mời.
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));
        List<Relationship> relationships = relationshipRepository.findAllByUser1AndStatus(user, RelationshipStatus.PENDING);
        return relationships.stream()
                .map(relationship -> relationship.getUser2().getId())
                .collect(Collectors.toList());
    }
    public List<String> getFriends(String userId) { // trả về danh sách id người mà bạn đã kết bạn
        userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));
        return relationshipRepository.findFriendIdsByUserId(userId, RelationshipStatus.ACCEPTED);
    }

    public List<String> getBlocks(String userId) { //trả về danh sách id người mà bạn đã chặn.
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));
        List<Relationship> relationships = relationshipRepository.findAllByUser1AndStatus(user, RelationshipStatus.BLOCKED);
        return relationships.stream()
                .map(relationship -> relationship.getUser2().getId())
                .collect(Collectors.toList());
    }

    public List<String> getReceiverRequest(String userId) { //trả về danh sách id người mà đang yêu cầu kết bạn
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));
        List<Relationship> relationships = relationshipRepository.findAllByUser2AndStatus(user, RelationshipStatus.PENDING);
        return relationships.stream()
                .map(relationship -> relationship.getUser1().getId())
                .collect(Collectors.toList());
    }
}
