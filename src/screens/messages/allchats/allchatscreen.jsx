import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Image, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOtherUserInfoApi } from '../../../api/profileapi'; 
import styles from './allchatstyle'; 

const AllChatScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState({}); 

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(parseInt(storedUserId, 10));
        }
      } catch (error) {
        console.error('Error fetching userId from storage:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchConversations = async () => {
        try {
          const response = await axios.get(`http://localhost:9001/chat/${userId}`);
          const data = Array.isArray(response.data) ? response.data[0] : [];
          setConversations(data);

          // Lấy thông tin chi tiết người dùng cho từng cuộc trò chuyện
          const details = {};
          const promises = data.map(async (conversation) => {
            const userDetailResponse = await getOtherUserInfoApi(conversation.user2_id);
            if (userDetailResponse.code === 1000) {
              details[conversation.user2_id] = userDetailResponse.result;
            }
          });
          await Promise.all(promises); // Thực hiện song song các lời gọi API
          setUserDetails(details);
        } catch (error) {
          console.error('Error fetching chat conversations or user details:', error);
        }
      };

      fetchConversations();
    }
  }, [userId]);

  const renderItem = ({ item }) => {
    const userDetail = userDetails[item.user2_id] || {};
    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() =>
          navigation.navigate('ChatUserScreen', {
            senderId: userId,
            receiverId: item.user2_id,
          })
        }
      >
        <Image
          source={
            userDetail.avatar_path && userDetail.avatar_path.startsWith('http')
              ? { uri: userDetail.avatar_path }
              : require('../../../../assets/image/avatar_icon.png')
          }
          style={styles.avatar}
        />
        <View style={styles.conversationDetails}>
          <Text style={styles.username}>{userDetail.username || 'Unknown User'}</Text>
          <Text style={styles.lastMessage}>{item.message || 'No message available'}</Text>
        </View>
        <Text style={styles.timestamp}>
          {item.sent_at ? new Date(item.sent_at).toLocaleTimeString() : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.message_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.conversationList}
      />
    </View>
  );
};

export default AllChatScreen;
