package com.example.together.controller;

import com.example.together.dto.response.ApiResponse;
import com.example.together.dto.response.GroupMessageResponse;
import com.example.together.dto.response.PrivateMessageResponse;
import com.example.together.model.GroupMessage;
import com.example.together.service.GroupMessageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("messageGroup")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GroupMessageController {
    GroupMessageService groupMessageService;


    @PostMapping("/private/{id}/{page}/{size}") //phan trang group message trong 1 nhom
    ApiResponse<Page<GroupMessageResponse>> getPageGroupChat(
            @PathVariable Long id,
            @PathVariable int page,
            @PathVariable int size
    ){
        Page<GroupMessageResponse> result = groupMessageService.getPageMessageByGroupId(
                id,
                page,
                size
        );
        return ApiResponse.<Page<GroupMessageResponse>>builder()
                .result(result)
                .build();
    }
}
