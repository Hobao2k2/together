package com.example.together.controller;

import com.example.together.dto.request.GroupChatCreationRequest;
import com.example.together.dto.request.UserCreationRequest;
import com.example.together.dto.response.ApiResponse;
import com.example.together.dto.response.GroupChatResponse;
import com.example.together.dto.response.UserResponse;
import com.example.together.service.GroupChatService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GroupChatController {

    GroupChatService groupChatService;

    @PostMapping("/groups")
    ApiResponse<GroupChatResponse> createGroupChat(@RequestBody GroupChatCreationRequest request) {
        return ApiResponse.<GroupChatResponse>builder()
                .result(groupChatService.createGroupChat(request))
                .build();
    }

    @GetMapping("/groups")
    ApiResponse<List<GroupChatResponse>> getGroupChat(){
        return ApiResponse.<List<GroupChatResponse>>builder()
                .result(groupChatService.getGroupChat())
                .build();
    }
}
