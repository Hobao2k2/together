package com.example.together.repository;

import com.example.together.model.GroupChat;
import com.example.together.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupChatRepository extends JpaRepository<GroupChat,Long> {
    Optional<GroupChat> findById(Long id);
}
