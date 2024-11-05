package com.example.together.controller;

import com.example.together.dto.response.ApiResponse;
import com.example.together.dto.response.GroupMessageResponse;
import com.example.together.dto.response.PrivateMessageResponse;
import com.example.together.model.GroupMessage;
import com.example.together.service.GroupMessageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("messageGroup")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GroupMessageController {
    GroupMessageService groupMessageService;

    @PostMapping("/private/{id}")
    ApiResponse<List<GroupMessageResponse>> getGroupChat(@PathVariable Long id){
        return ApiResponse.<List<GroupMessageResponse>>builder()
                .result(groupMessageService.getMessageByGroupId(id))
                .build();
    }
}
