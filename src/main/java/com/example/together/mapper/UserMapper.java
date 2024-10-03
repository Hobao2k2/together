package com.example.together.mapper;

import com.example.together.dto.request.UserCreationRequest;
import com.example.together.dto.request.UserUpdateRequest;
import com.example.together.dto.response.UserResponse;
import com.example.together.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);

    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}