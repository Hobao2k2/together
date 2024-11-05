package com.example.together.mapper;

import com.example.together.dto.response.GroupMessageResponse;
import com.example.together.model.GroupMessage;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22 (Oracle Corporation)"
)
@Component
public class GroupMessageMapperImpl implements GroupMessageMapper {

    @Override
    public GroupMessageResponse toGroupMessageResponse(GroupMessage groupMessage) {
        if ( groupMessage == null ) {
            return null;
        }

        GroupMessageResponse.GroupMessageResponseBuilder groupMessageResponse = GroupMessageResponse.builder();

        groupMessageResponse.content( groupMessage.getContent() );
        groupMessageResponse.sentAt( groupMessage.getSentAt() );

        groupMessageResponse.sender( groupMessage.getSender().getId() );
        groupMessageResponse.group( groupMessage.getGroup().getId() );

        return groupMessageResponse.build();
    }
}
