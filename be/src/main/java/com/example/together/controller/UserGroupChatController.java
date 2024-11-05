package com.example.together.controller;

import com.example.together.dto.request.AddUsersToGroupChatRequest;
import com.example.together.dto.response.ApiResponse;
import com.example.together.dto.response.UserResponse;
import com.example.together.service.UserGroupChatService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/groups")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserGroupChatController {
    UserGroupChatService userGroupChatService;

    @PostMapping("/addUsers")
    public ApiResponse<String> addUserToGroupChat(@RequestBody AddUsersToGroupChatRequest request){
        return ApiResponse.<String>builder().result(userGroupChatService
                        .addUsersToGroupChat(request.getUserIds(), request.getGroupId()))
                .build();
    }

    @PostMapping("/userInGroup/{groupId}")
    public ApiResponse<List<UserResponse>> getMembersByGroupId(@PathVariable Long groupId){
        return ApiResponse.<List<UserResponse>>builder().result(userGroupChatService
                .getMembersByGroupId(groupId)).build();
    }

    @DeleteMapping("/{userId}/{groupId}")
    public ApiResponse<String> deleteUserFromGroup(@PathVariable String userId,@PathVariable Long groupId){
        return ApiResponse.<String>builder().result(userGroupChatService
                .deleteUserFromGroup(userId,groupId)).build();
    }

    @PostMapping("/members/search/{groupId}/{key}")
    public List<UserResponse> searchMembersByGroupIdAndUserName(@PathVariable Long groupId,@PathVariable String key) {
        return userGroupChatService.searchMembersByGroupIdAndUserName(groupId, key);
    }
}
