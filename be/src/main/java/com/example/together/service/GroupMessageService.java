package com.example.together.service;

import com.example.together.dto.response.GroupMessageResponse;
import com.example.together.exception.AppException;
import com.example.together.exception.ErrorCode;
import com.example.together.mapper.GroupMessageMapper;
import com.example.together.model.GroupChat;
import com.example.together.model.GroupMessage;
import com.example.together.model.PrivateMessage;
import com.example.together.repository.GroupChatRepository;
import com.example.together.repository.GroupMessageRepository;
import com.example.together.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GroupMessageService {

    UserRepository userRepository;
    GroupChatRepository groupChatRepository;
    GroupMessageRepository groupMessageRepository;
    GroupMessageMapper groupMessageMapper;

    public void createGroupMessage(GroupMessage groupMessage){
        groupMessage.setSentAt(LocalDateTime.now());
        groupMessageRepository.save(groupMessage);
    }

    public List<GroupMessageResponse> getMessageByGroupId(Long groupId){
        GroupChat groupChat=groupChatRepository.findById(groupId).orElseThrow(()
                -> new AppException(ErrorCode.INVALID_GROUPCHAT));
        return groupMessageRepository.findByGroup(groupChat).stream().map(groupMessageMapper::toGroupMessageResponse).toList();
    }
}
