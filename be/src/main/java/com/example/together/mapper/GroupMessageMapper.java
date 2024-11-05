package com.example.together.mapper;

import com.example.together.dto.response.GroupMessageResponse;
import com.example.together.model.GroupMessage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GroupMessageMapper {
    @Mapping(target = "sender", expression = "java(groupMessage.getSender().getId())")
    @Mapping(target = "group", expression = "java(groupMessage.getGroup().getId())")
    GroupMessageResponse toGroupMessageResponse(GroupMessage groupMessage);
}
