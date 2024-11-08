package com.example.together.controller;

import com.example.together.dto.request.PrivateMessageRequest;
import com.example.together.dto.response.ApiResponse;
import com.example.together.dto.response.GroupChatResponse;
import com.example.together.dto.response.PrivateMessageResponse;
import com.example.together.model.PrivateMessage;
import com.example.together.service.PrivateMessageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("message")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PrivateMessageController {

    PrivateMessageService privateMessageService;
    @GetMapping("/private")
    ApiResponse<List<PrivateMessageResponse>> getGroupChat(){
        return ApiResponse.<List<PrivateMessageResponse>>builder()
                .result(privateMessageService.getAllPrivateMessage())
                .build();
    }
    @PostMapping("/private/sender")
    ApiResponse<List<PrivateMessageResponse>> getSenderMessage(@RequestBody PrivateMessageRequest privateMessageRequest){
        return ApiResponse.<List<PrivateMessageResponse>>builder()
                .result(privateMessageService.getSenderMessage(privateMessageRequest.getUserSenderId()))
                .build();
    }


    @PostMapping("/private/sender/{key}")  //tim kiem tin nhan trong doan chat
    ApiResponse<List<PrivateMessageResponse>> getSenderMessageToKey(
            @RequestBody PrivateMessageRequest privateMessageRequest
            ,@PathVariable String key
    ){
        return ApiResponse.<List<PrivateMessageResponse>>builder()
                .result(privateMessageService.getSenderMessageToKey(privateMessageRequest.getUserSenderId()
                ,privateMessageRequest.getUserReceiverId(),key))
                .build();
    }

    @PostMapping("/sender/id/{page}/{size}") //phan trang tin nhan giua 2 user
    public ApiResponse<Page<PrivateMessageResponse>> getSenderMessageToUserId(
            @RequestBody PrivateMessageRequest privateMessageRequest,
            @PathVariable int page,@PathVariable int size) {

        Page<PrivateMessageResponse> result = privateMessageService.getSenderMessageToUserId(
                privateMessageRequest.getUserSenderId(),
                privateMessageRequest.getUserReceiverId(),
                page,
                size
        );

        return ApiResponse.<Page<PrivateMessageResponse>>builder()
                .result(result)
                .build();
    }
}
