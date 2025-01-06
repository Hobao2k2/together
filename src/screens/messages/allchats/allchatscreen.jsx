import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, useColorScheme } from 'react-native';
import { getUserCredentials } from '../../../api/profileapi';
import { getChatList } from '../../../api/message';
import styles from './allchatstyle';
import { colorStyles } from '../../../styles/colorScheme';

const AllChatScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // Lưu `userId` từ thông tin người dùng
  const scheme = useColorScheme(); // Lấy chế độ sáng/tối từ hệ thống
  const colors = colorStyles[scheme] || colorStyles.light; // Áp dụng màu dựa trên chế độ

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { userId } = await getUserCredentials(); // Lấy `userId` từ thông tin người dùng
        setUserId(userId); // Lưu `userId` vào state
        const data = await getChatList(userId); // Gọi API để lấy danh sách trò chuyện
        setChats(data);
      } catch (err) {
        console.error('Error fetching chats: ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  // Hàm xử lý khi người dùng nhấp vào một cuộc trò chuyện
  const handleChatClick = (receiverId) => {
    if (userId) {
      navigation.navigate('Messages', {
        screen: 'ChatUser',
        params: {
          senderId: userId, // ID của người gửi
          receiverId: receiverId, // ID của người nhận
        },
      });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.chatItem,
        {
          backgroundColor: colors.background, // Màu nền dựa trên chế độ
          borderColor: colors.border, // Màu viền dựa trên chế độ
        },
      ]}
      onPress={() => handleChatClick(item.user2_id)} // Điều hướng khi nhấp
    >
      <Image
        source={item.user2_avatar_path ? { uri: item.user2_avatar_path } : require('../../../../assets/image/avatar_icon.png')}
        style={styles.avatar}
      />
      <View style={styles.chatDetails}>
        <Text style={[styles.userName, { color: colors.text }]}>
          {item.user2_name || 'Unknown User'}
        </Text>
        <Text style={[styles.message, { color: colors.text }]}>
          {item.message || '...'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background }, // Nền tổng thể dựa trên chế độ
      ]}
    >
      <View style={styles.headerContainer}>
        <Text style={[styles.header, { color: colors.text }]}>Chat</Text>
      </View>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.message_id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default AllChatScreen;
