import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Image, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './allchatstyle';

const AllChatScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [userId, setUserId] = useState(null);

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
          const response = await axios.get(`http://10.0.88.20:9001/chat/${userId}`);
          setConversations(response.data);
        } catch (error) {
          console.error('Error fetching chat conversations:', error);
        }
      };

      fetchConversations();
    }
  }, [userId]);

  const renderItem = ({ item }) => (
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
          item.user2_avatar_path && item.user2_avatar_path.startsWith('http')
            ? { uri: item.user2_avatar_path }
            : require('../../../../assets/image/avatar_icon.png')
        }
        style={styles.avatar}
      />
      <View style={styles.conversationDetails}>
        <Text style={styles.username}>{item.user2_name}</Text>
        <Text style={styles.lastMessage}>{item.message}</Text>
      </View>
      <Text style={styles.timestamp}>
        {new Date(item.sent_at).toLocaleTimeString()}
      </Text>
    </TouchableOpacity>
  );

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
