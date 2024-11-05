package com.example.together.mapper;

import com.example.together.dto.request.GroupChatCreationRequest;
import com.example.together.dto.response.GroupChatResponse;
import com.example.together.model.GroupChat;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GroupChatMapper {
    GroupChat toGroupChat(GroupChatCreationRequest groupChatCreationRequest);
    @Mapping(target = "createdBy", expression = "java(groupChat.getCreatedBy().getId())")
    GroupChatResponse toGroupChatResponse(GroupChat groupChat);
}
