package com.example.together.repository;

import com.example.together.model.GroupChat;
import com.example.together.model.GroupMessage;
import com.example.together.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupMessageRepository extends JpaRepository<GroupMessage,Long> {

    Page<GroupMessage> findByGroup(GroupChat groupChat, Pageable pageable);
}
