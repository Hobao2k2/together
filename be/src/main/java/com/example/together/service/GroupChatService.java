package com.example.together.service;

import com.example.together.dto.request.GroupChatCreationRequest;
import com.example.together.dto.response.GroupChatResponse;
import com.example.together.exception.AppException;
import com.example.together.exception.ErrorCode;
import com.example.together.mapper.GroupChatMapper;
import com.example.together.model.GroupChat;
import com.example.together.model.User;
import com.example.together.repository.GroupChatRepository;
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
public class GroupChatService {

    GroupChatRepository groupChatRepository;
    GroupChatMapper groupChatMapper;
    UserRepository userRepository;

    public GroupChatResponse createGroupChat(GroupChatCreationRequest groupChatCreationRequest){
        User createdBy = userRepository.findById(groupChatCreationRequest.getCreatedById())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_USER));
        groupChatCreationRequest.setCreatedAt(LocalDateTime.now());
        GroupChat groupChat = groupChatMapper.toGroupChat(groupChatCreationRequest);
        groupChat.setCreatedBy(createdBy);
        return groupChatMapper.toGroupChatResponse(groupChatRepository.save(groupChat));
    }

    public List<GroupChatResponse> getGroupChat(){
        return groupChatRepository.findAll().stream().map(groupChatMapper::toGroupChatResponse).toList();
    }
}
