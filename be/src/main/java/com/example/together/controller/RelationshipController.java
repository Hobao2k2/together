package com.example.together.controller;

import com.example.together.dto.request.RelationshipRequest;
import com.example.together.dto.response.ApiResponse;
import com.example.together.dto.response.UserResponse;
import com.example.together.model.User;
import com.example.together.service.RelationshipService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friends")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RelationshipController {
    RelationshipService relationshipService;

    @PostMapping("/send-request")
    ApiResponse<String> sendFriendRequest(@RequestBody RelationshipRequest request){
        return ApiResponse.<String>builder()
                .result(relationshipService.sendFriendRequest(request.getSenderId(),request.getReceiverId()))
                .build();
    }

    @PostMapping("/accept-request")
    ApiResponse<String> acceptFirendRequest(@RequestBody RelationshipRequest request){
        return ApiResponse.<String>builder()
                .result(relationshipService.acceptFriendRequest(request.getSenderId(),request.getReceiverId()))
                .build();
    }

    @PostMapping("/block")
    ApiResponse<String> blockRequest(@RequestBody RelationshipRequest request){
        return ApiResponse.<String>builder()
                .result(relationshipService.blockUser(request.getSenderId(),request.getReceiverId()))
                .build();
    }

    @PostMapping("/unfriend")
    ApiResponse<String> unFirend(@RequestBody RelationshipRequest request){
        return ApiResponse.<String>builder()
                .result(relationshipService.unfriend(request.getSenderId(),request.getReceiverId()))
                .build();
    }

    @PostMapping("/reject-request")
    ApiResponse<String> reject(@RequestBody RelationshipRequest request){
        return ApiResponse.<String>builder()
                .result(relationshipService.rejectFriendRequest(request.getSenderId(),request.getReceiverId()))
                .build();
    }

    @GetMapping("/send-friend") // danh sách đã gửi kết bạn
    ApiResponse<List<String>> getSendFriendRequest(@RequestBody RelationshipRequest request){
        return ApiResponse.<List<String>>builder()
                .result(relationshipService.getSendFriendRequest(request.getSenderId()))
                .build();
    }

    @GetMapping// danh sách bạn bè
    ApiResponse<List<String>> getFriend(@RequestBody RelationshipRequest request){
        return ApiResponse.<List<String>>builder()
                .result(relationshipService.getFriends(request.getSenderId()))
                .build();
    }

    @GetMapping("/blocks") // danh sách đang chặn
    ApiResponse<List<String>> getBlocks(@RequestBody RelationshipRequest request){
        return ApiResponse.<List<String>>builder()
                .result(relationshipService.getBlocks(request.getSenderId()))
                .build();
    }
    @GetMapping("/receiver-request") // danh sách đang chặn
    ApiResponse<List<String>> getReceiverRequest(@RequestBody RelationshipRequest request){
        return ApiResponse.<List<String>>builder()
                .result(relationshipService.getReceiverRequest(request.getSenderId()))
                .build();
    }
}
