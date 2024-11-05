package com.example.together.mapper;

import com.example.together.dto.request.GroupChatCreationRequest;
import com.example.together.dto.response.GroupChatResponse;
import com.example.together.model.GroupChat;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22 (Oracle Corporation)"
)
@Component
public class GroupChatMapperImpl implements GroupChatMapper {

    @Override
    public GroupChat toGroupChat(GroupChatCreationRequest groupChatCreationRequest) {
        if ( groupChatCreationRequest == null ) {
            return null;
        }

        GroupChat groupChat = new GroupChat();

        groupChat.setName( groupChatCreationRequest.getName() );
        groupChat.setCreatedAt( groupChatCreationRequest.getCreatedAt() );

        return groupChat;
    }

    @Override
    public GroupChatResponse toGroupChatResponse(GroupChat groupChat) {
        if ( groupChat == null ) {
            return null;
        }

        GroupChatResponse.GroupChatResponseBuilder groupChatResponse = GroupChatResponse.builder();

        groupChatResponse.id( groupChat.getId() );
        groupChatResponse.name( groupChat.getName() );
        groupChatResponse.createdAt( groupChat.getCreatedAt() );

        groupChatResponse.createdBy( groupChat.getCreatedBy().getId() );

        return groupChatResponse.build();
    }
}
