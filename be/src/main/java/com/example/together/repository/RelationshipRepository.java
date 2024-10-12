package com.example.together.repository;

import com.example.together.enumconfig.RelationshipStatus;
import com.example.together.model.Relationship;
import com.example.together.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RelationshipRepository extends JpaRepository<Relationship,Long> {
    List<Relationship> findAllByUser1AndStatus(User user, RelationshipStatus status);
    Optional<Relationship> findByUser1AndUser2AndStatus(User user1,User user2,RelationshipStatus status);
    @Query("SELECT CASE WHEN r.user1.id = :userId THEN r.user2.id ELSE r.user1.id END FROM Relationship r WHERE (r.user1.id = :userId OR r.user2.id = :userId) AND r.status = :status")
    List<String> findFriendIdsByUserId(@Param("userId") String userId, @Param("status") RelationshipStatus status);
    List<Relationship> findAllByUser2AndStatus(User user, RelationshipStatus relationshipStatus);
}
