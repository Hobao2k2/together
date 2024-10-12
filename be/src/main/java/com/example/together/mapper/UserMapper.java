package com.example.together.mapper;

import com.example.together.dto.request.UserCreationRequest;
import com.example.together.dto.request.UserUpdateRequest;
import com.example.together.dto.response.UserResponse;
import com.example.together.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);
    @Mapping(source="friendshipsInitiated",target = "friendshipsInitiated")
    UserResponse toUserResponse(User user);

    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}