import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const CreateGroupScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Michael Johnson' },
    { id: 4, name: 'Emily Davis' },
    // Thêm người dùng thực tế vào đây
  ];

  const toggleUserSelection = (user) => {
    setSelectedUsers((prev) => {
      if (prev.includes(user)) {
        return prev.filter((item) => item !== user);
      } else {
        return [...prev, user];
      }
    });
  };

  const createGroup = () => {
    if (selectedUsers.length !== 2) {
      Alert.alert('Lỗi', 'Vui lòng chọn 2 người để tạo nhóm');
      return;
    }

    // Giả sử bạn gửi dữ liệu tới backend và nhóm được tạo thành công
    Alert.alert('Thành công', 'Tạo nhóm thành công!');

    // Quay lại màn hình chat
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo nhóm chat</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập tên nhóm"
        value={groupName}
        onChangeText={setGroupName}
      />

      <Text>Chọn 2 người tham gia nhóm:</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.userItem, selectedUsers.includes(item) && styles.selectedUser]}
            onPress={() => toggleUserSelection(item)}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Button title="Tạo nhóm" onPress={createGroup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  selectedUser: {
    backgroundColor: '#007AFF',
    color: '#FFF',
  },
});

export default CreateGroupScreen;
