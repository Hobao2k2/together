package com.example.together.repository;

import com.example.together.model.GroupChat;
import com.example.together.model.User;
import com.example.together.model.UserGroupChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserGroupChatRepository extends JpaRepository<UserGroupChat,Long> {
    boolean existsByUserAndGroup(User user, GroupChat group);
    List<UserGroupChat> findByGroup_Id(Long groupId);

    void deleteByUserIdAndGroupId(String userId, Long groupId);

    List<UserGroupChat> findByGroup_IdAndUser_UsernameContainingIgnoreCase(Long groupId, String username);
}
