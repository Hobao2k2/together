package com.example.together.mapper;

import com.example.together.dto.response.PrivateMessageResponse;
import com.example.together.model.PrivateMessage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PrivateMessageMapper {
    @Mapping(target = "sender", expression = "java(privateMessage.getSender().getId())")
    @Mapping(target = "receiver", expression = "java(privateMessage.getReceiver().getId())")
    PrivateMessageResponse toPrivateMessageResponse(PrivateMessage privateMessage);
}
