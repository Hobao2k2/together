import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Button, Alert, ScrollView } from 'react-native';
import { fetchPosts, deletePost } from '../api/postsApi';  
import { useIsFocused } from '@react-navigation/native'; 
import styles from './homestyle';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const isFocused = useIsFocused(); // Để refresh lại dữ liệu khi quay lại màn hình Home
  const [loading, setLoading] = useState(false);

  // Hàm để fetch các bài viết từ backend
  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await fetchPosts();  // Sử dụng hàm fetchPosts từ API
      setPosts(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Lỗi', 'Không thể tải danh sách bài viết');
    }
  };

  // Sử dụng useEffect để gọi API khi màn hình được render
  useEffect(() => {
    if (isFocused) {
      loadPosts();  // Gọi hàm loadPosts để tải dữ liệu
    }
  }, [isFocused]);

  // Hàm xử lý xóa bài viết
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);  // Sử dụng hàm deletePost từ API
      Alert.alert('Thông báo', 'Xóa bài viết thành công!');
      loadPosts(); // Refresh lại danh sách bài viết sau khi xóa
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa bài viết');
    }
  };

  // Giao diện mỗi bài viết
  const renderPostItem = ({ item }) => {
    return (
      <View style={styles.postContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.content}>
          {item.content}
        </Text>

        {item.images && item.images.length > 0 && (
          <ScrollView horizontal>
            {item.images.map((image, index) => (
              <Image key={index} source={{ uri: image.uri }} style={styles.image} />
            ))}
          </ScrollView>
        )}

        {item.video && (
          <Text>Video: {item.video.fileName}</Text>
        )}

        {/* Các nút thao tác */}
        <View style={styles.actions}>
          <Button
            title="Chỉnh sửa"
            onPress={() => navigation.navigate('EditPost', { postId: item.id })}
          />
          <Button
            title="Xóa"
            color="red"
            onPress={() => handleDeletePost(item.id)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Đang tải...</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPostItem}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPost')}
      >
        <Text style={styles.addButtonText}>+ Thêm bài viết</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
