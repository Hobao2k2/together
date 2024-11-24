import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { fetchMessages, sendMessage } from '../../../api/message';

const ChatUserScreen = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState([]); // Danh sách tin nhắn
  const [page, setPage] = useState(1); // Trang hiện tại
  const [loading, setLoading] = useState(false); // Trạng thái tải tin nhắn
  const [newMessage, setNewMessage] = useState(''); // Tin nhắn mới
  const [hasMore, setHasMore] = useState(true); // Kiểm tra còn tin nhắn không

  // Lấy dữ liệu tin nhắn khi component load hoặc page thay đổi
  useEffect(() => {
    loadMessages();
  }, [page]);

  const loadMessages = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const data = await fetchMessages(senderId, receiverId, page, 20); // 20 tin nhắn mỗi lần
      if (data.length === 0) setHasMore(false); // Nếu không còn dữ liệu
      setMessages((prevMessages) => [...data.reverse(), ...prevMessages]); // Thêm tin nhắn cũ vào đầu danh sách
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
  
    // Hiển thị tin nhắn mới trong danh sách trước
    const tempMessage = {
      senderId,
      content: newMessage,
      createdAt: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, tempMessage]);
    setNewMessage(''); // Reset ô nhập
  
    try {
      // Gửi tin nhắn qua API
      await sendMessage(senderId, receiverId, newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      // Có thể thêm logic để hiển thị thông báo lỗi nếu cần
    }
  };  

  return (
    <View style={styles.container}>
      {/* Danh sách tin nhắn */}
      <FlatList
        data={messages}
        inverted // Hiển thị từ dưới lên
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
        onEndReached={() => {
          if (hasMore && !loading) setPage((prevPage) => prevPage + 1);
        }} // Kéo lên để tải tin nhắn cũ
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" color="#007bff" /> : null
        }
      />

      {/* Khu vực nhập tin nhắn */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatUserScreen;
