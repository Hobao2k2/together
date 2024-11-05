package com.example.together.repository;

import com.example.together.model.PrivateMessage;
import com.example.together.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrivateMessageRepository extends JpaRepository<PrivateMessage,Long> {
    List<PrivateMessage> findBySender(User sender);
    List<PrivateMessage> findBySenderAndReceiver(User sender,User receiver);
}
