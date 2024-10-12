package com.example.together.mapper;

import com.example.together.dto.request.UserCreationRequest;
import com.example.together.dto.request.UserUpdateRequest;
import com.example.together.dto.response.RelationshipResponse;
import com.example.together.dto.response.UserResponse;
import com.example.together.model.Relationship;
import com.example.together.model.User;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toUser(UserCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        User user = new User();

        user.setEmail( request.getEmail() );
        user.setUsername( request.getUsername() );
        user.setPassword( request.getPassword() );
        user.setDob( request.getDob() );

        return user;
    }

    @Override
    public UserResponse toUserResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        userResponse.friendshipsInitiated( relationshipSetToRelationshipResponseSet( user.getFriendshipsInitiated() ) );
        userResponse.id( user.getId() );
        userResponse.email( user.getEmail() );
        userResponse.username( user.getUsername() );
        userResponse.dob( user.getDob() );

        return userResponse.build();
    }

    @Override
    public void updateUser(User user, UserUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        user.setUsername( request.getUsername() );
        user.setPassword( request.getPassword() );
        user.setDob( request.getDob() );
    }

    protected RelationshipResponse relationshipToRelationshipResponse(Relationship relationship) {
        if ( relationship == null ) {
            return null;
        }

        RelationshipResponse.RelationshipResponseBuilder relationshipResponse = RelationshipResponse.builder();

        relationshipResponse.id( relationship.getId() );
        relationshipResponse.user2( toUserResponse( relationship.getUser2() ) );
        relationshipResponse.status( relationship.getStatus() );
        relationshipResponse.createdAt( relationship.getCreatedAt() );

        return relationshipResponse.build();
    }

    protected Set<RelationshipResponse> relationshipSetToRelationshipResponseSet(Set<Relationship> set) {
        if ( set == null ) {
            return null;
        }

        Set<RelationshipResponse> set1 = new LinkedHashSet<RelationshipResponse>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( Relationship relationship : set ) {
            set1.add( relationshipToRelationshipResponse( relationship ) );
        }

        return set1;
    }
}
