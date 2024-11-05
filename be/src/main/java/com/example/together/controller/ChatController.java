package com.example.together.controller;

import com.example.together.model.GroupMessage;
import com.example.together.model.Message;
import com.example.together.model.PrivateMessage;
import com.example.together.service.GroupMessageService;
import com.example.together.service.PrivateMessageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;


@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {

    SimpMessagingTemplate simpMessagingTemplate;

    PrivateMessageService privateMessageService;

    GroupMessageService groupMessageService;

    @MessageMapping("/send")
    public void sendMessage(@Payload PrivateMessage message) {
        PrivateMessage privateMessage=message;
        // Lưu tin nhắn vào cơ sở dữ liệu
        privateMessageService.createPrivateMessage(message);

        // Gửi tin nhắn đến người nhận
        simpMessagingTemplate.convertAndSendToUser(message.getReceiver().getId(), "/private", message);
    }


    @MessageMapping("/group/{groupId}/sendMessage")  //endpoint để client gửi tin nhắn đến
    public void sendGroupMessage(GroupMessage groupMessage, @DestinationVariable Long groupId) {
        groupMessageService.createGroupMessage(groupMessage);

        // gửi tin nhắn tới tất cả người đăng ký /topic/group/{groupId}
        simpMessagingTemplate.convertAndSend("/topic/group/" + groupId, groupMessage);
    }
}

