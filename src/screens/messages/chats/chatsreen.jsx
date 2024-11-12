import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatScreen = ({ route }) => {
  const { userId, username } = route.params; // Lấy thông tin từ điều hướng

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat với {username}</Text>
      {/* Thêm giao diện chat ở đây */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ChatScreen;
