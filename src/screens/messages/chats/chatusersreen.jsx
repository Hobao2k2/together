import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import biểu tượng Ionicons
import { useNavigation } from '@react-navigation/native';
import { fetchMessages, sendMessage } from '../../../api/message';
import styles from './chatuserstyle';

const ChatUserScreen = ({ senderId, receiverId }) => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [page]);

  const loadMessages = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const data = await fetchMessages(senderId, receiverId, page, 20);
      if (data.length === 0) setHasMore(false);
      setMessages((prevMessages) => [...data.reverse(), ...prevMessages]);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const tempMessage = {
      senderId,
      content: newMessage,
      createdAt: new Date(),
    };
    setMessages((prevMessages) => [tempMessage, ...prevMessages]);
    setNewMessage('');

    try {
      await sendMessage(senderId, receiverId, newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }) => {
    const isSender = item.senderId === senderId;
    return (
      <View
        style={[
          styles.messageContainer,
          isSender ? styles.senderMessage : styles.receiverMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()} // Quay lại màn hình trước đó
      >
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Danh sách tin nhắn */}
      <FlatList
        data={messages}
        inverted
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
        onEndReached={() => {
          if (hasMore && !loading) setPage((prevPage) => prevPage + 1);
        }}
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
