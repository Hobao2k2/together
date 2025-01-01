import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, Image, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colorStyles } from '../../../styles/colorScheme'; // Thay thế bằng file màu của bạn
import socketServices from '../../../api/WSService';
import { getOtherUserInfoApi } from '../../../api/profileapi';
import styles from './chatuserstyle';
import axios from 'axios';

const ChatUserScreen = ({ route, navigation }) => {
  const scheme = useColorScheme();
  const colors = colorStyles[scheme] || colorStyles.light;

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [receiverInfo, setReceiverInfo] = useState(null);
  const { senderId, receiverId } = route.params;
  const flatListRef = React.useRef(null);

  useEffect(() => {
    const initializeSocket = async () => {
      await socketServices.initializeSocket();
      const hash = maHoa(senderId, receiverId);

      // Lắng nghe sự kiện tin nhắn mới
      socketServices.on(`send_${hash}`, (message) => {
        const updatedMessage = {
          ...message,
          sent_at: new Date(message.sent_at), // Chuyển thành đối tượng Date
        };
      
        setMessages((prevMessages) => {
          const existingMessageIds = new Set(prevMessages.map((msg) => msg.id));
          if (!existingMessageIds.has(updatedMessage.id)) {
            const updatedMessages = [...prevMessages, updatedMessage].sort(sortByTime);
            return updatedMessages;
          }
          return prevMessages;
        });
      
        // Cuộn đến tin nhắn cuối
        flatListRef.current?.scrollToEnd({ animated: true });
      });      
    };

    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          `http://10.0.88.20:9001/detail-chat/${senderId}/${receiverId}`
        );
    
        const updatedMessages = response.data.map((message) => ({
          ...message,
          sent_at: new Date(message.sent_at), // Chuyển đổi sang đối tượng Date
        }));
    
        setMessages((prevMessages) => {
          const existingMessageIds = new Set(prevMessages.map((msg) => msg.id)); // Dựa vào ID hoặc unique field
          const newMessages = updatedMessages.filter((msg) => !existingMessageIds.has(msg.id));
          return [...prevMessages, ...newMessages].sort(sortByTime);
        });
      } catch (error) {
        console.error('Lỗi khi lấy lịch sử tin nhắn:', error);
      }
    };
        

    const sortByTime = (a, b) => new Date(a.sent_at) - new Date(b.sent_at);

    const fetchReceiverInfo = async () => {
      try {
        const response = await getOtherUserInfoApi(receiverId);
        setReceiverInfo(response.result);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người nhận:', error);
      }
    };

    initializeSocket();
    fetchChatHistory();
    fetchReceiverInfo();

    return () => {
      socketServices.socket?.disconnect();
    };
  }, [senderId, receiverId]);

  const maHoa = (id1, id2) => {
    const sortedIds = [id1, id2].sort();
    const combined = sortedIds.join('-');
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash * 31 + char) % 1e9;
    }
    return hash;
  };

  const sortByTime = (a, b) => new Date(a.sent_at) - new Date(b.sent_at);

  const getCurrentTime = () => {
    const now = new Date();
  
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  
    // MySQL format: YYYY-MM-DD HH:mm:ss.SSS
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };    

  const sendMessage = () => {
    if (!messageText.trim()) return;

    const message = {
      content: messageText,
      sender_id: senderId,
      receiver_id: receiverId,
      sent_at: getCurrentTime(), // Chuyển đổi thời gian
    };

    const hash = maHoa(senderId, receiverId);

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, message].sort(sortByTime);
      return updatedMessages;
    });

    socketServices.emit('send_mess', { hash, message });

    setMessageText('');
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const renderMessageItem = ({ item }) => {
    const isMyMessage = item.sender_id === senderId;
    const timestamp = new Date(item.sent_at).toLocaleTimeString(); // Hiển thị thời gian
  
    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    );
  };  

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.header, { borderBottomColor: colors.border }]}> 
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        {receiverInfo && (
          <View style={styles.receiverInfo}>
            <Image
              source={
                receiverInfo.avatar_path && receiverInfo.avatar_path.startsWith('http')
                  ? { uri: receiverInfo.avatar_path }
                  : require('../../../../assets/image/avatar_icon.png')
              }
              style={styles.avatar}
            />
            <Text style={[styles.username, { color: colors.text }]}>
              {receiverInfo.username || 'Người dùng'}
            </Text>
          </View>
        )}
      </View>
      <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      <View style={[styles.inputContainer, { borderColor: colors.border }]}> 
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor={colors.text}
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatUserScreen;
