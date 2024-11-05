package com.example.together.mapper;

import com.example.together.dto.response.PrivateMessageResponse;
import com.example.together.model.PrivateMessage;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22 (Oracle Corporation)"
)
@Component
public class PrivateMessageMapperImpl implements PrivateMessageMapper {

    @Override
    public PrivateMessageResponse toPrivateMessageResponse(PrivateMessage privateMessage) {
        if ( privateMessage == null ) {
            return null;
        }

        PrivateMessageResponse.PrivateMessageResponseBuilder privateMessageResponse = PrivateMessageResponse.builder();

        privateMessageResponse.content( privateMessage.getContent() );
        privateMessageResponse.sentAt( privateMessage.getSentAt() );

        privateMessageResponse.sender( privateMessage.getSender().getId() );
        privateMessageResponse.receiver( privateMessage.getReceiver().getId() );

        return privateMessageResponse.build();
    }
}
