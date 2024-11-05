package com.example.together.service;

import com.example.together.dto.response.UserResponse;
import com.example.together.exception.AppException;
import com.example.together.exception.ErrorCode;
import com.example.together.mapper.UserMapper;
import com.example.together.model.GroupChat;
import com.example.together.model.User;
import com.example.together.model.UserGroupChat;
import com.example.together.repository.GroupChatRepository;
import com.example.together.repository.UserGroupChatRepository;
import com.example.together.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserGroupChatService {
    UserGroupChatRepository userGroupChatRepository;
    UserRepository userRepository;
    GroupChatRepository groupChatRepository;
    UserMapper userMapper;

    @Transactional
    public String addUsersToGroupChat(List<String> userIds, Long groupId) {
        GroupChat groupChat = groupChatRepository.findById(groupId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_GROUPCHAT));
        StringBuilder resultMessage = new StringBuilder();
        for (String userId : userIds) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));

            boolean userAlreadyInGroup = userGroupChatRepository.existsByUserAndGroup(user, groupChat);

            if (userAlreadyInGroup) {
                resultMessage.append("User với ID: ").append(userId).append(" đã có trong nhóm. ");
                continue;
            }
            UserGroupChat userGroupChat = new UserGroupChat();
            userGroupChat.setUser(user);
            userGroupChat.setGroup(groupChat);
            userGroupChat.setJoinedAt(LocalDateTime.now());
            userGroupChatRepository.save(userGroupChat);

        }
        if (resultMessage.length() > 0) {
            return resultMessage.toString();
        } else {
            return "Đã thêm người dùng vào nhóm";
        }
    }

    @Transactional
    public String deleteUserFromGroup(String userId, Long groupId) {
        GroupChat groupChat = groupChatRepository.findById(groupId).orElseThrow(()
                -> new AppException(ErrorCode.INVALID_GROUPCHAT));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));
        userGroupChatRepository.deleteByUserIdAndGroupId(userId, groupId);
        return "Da xoa user voi id: " + userId + " ra khoi group voi id: " + groupId;
    }

    public List<UserResponse> getMembersByGroupId(Long groupId) {
        GroupChat groupChat = groupChatRepository.findById(groupId).orElseThrow(()
                -> new AppException(ErrorCode.INVALID_GROUPCHAT));
        List<UserGroupChat> userGroupChats = userGroupChatRepository.findByGroup_Id(groupId);
        return userGroupChats.stream()
                .map(UserGroupChat::getUser)
                .map(userMapper::toUserResponse) // Chuyển đổi User thành UserResponse
                .collect(Collectors.toList());
    }

    public List<UserResponse> searchMembersByGroupIdAndUserName(Long groupId, String userName) {
        GroupChat groupChat = groupChatRepository.findById(groupId).orElseThrow(()
                -> new AppException(ErrorCode.INVALID_GROUPCHAT));
        List<UserGroupChat> userGroupChats = userGroupChatRepository.findByGroup_IdAndUser_UsernameContainingIgnoreCase(groupId, userName);
        return userGroupChats.stream()
                .map(UserGroupChat::getUser)
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }
}
