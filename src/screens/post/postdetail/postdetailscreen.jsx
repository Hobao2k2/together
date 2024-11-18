import React from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity, Alert } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { getUserCredentials } from '../../../api/profileapi';
import styles from './postdetailstyle';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const PostDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { postDetail } = route.params;

  // Hàm chuyển sang màn hình Profile
  const handleNavigateToProfile = async (targetUserId) => {
    if (!targetUserId) {
      console.error('Không tìm thấy userId để chuyển đến trang cá nhân.');
      Alert.alert('Lỗi', 'Không thể chuyển đến trang cá nhân do thiếu thông tin người dùng.');
      return;
    }
  
    try {
      // Lấy userId đang đăng nhập từ AsyncStorage
      const { userId } = await getUserCredentials();
  
      console.log('Navigating to Profile. TargetUserId:', targetUserId, 'CurrentUserId:', userId);
  
      if (targetUserId === userId) {
        // Nếu targetUserId trùng với userId hiện tại, chuyển đến màn hình Profile
        navigation.navigate('Profile', {
          userId: targetUserId,
        });
      } else {
        // Nếu không, chuyển đến màn hình ProfileOtherUserScreen
        navigation.navigate('ProfileOtherUser', {
          userId: targetUserId,
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      Alert.alert('Lỗi', 'Không thể thực hiện điều hướng do lỗi dữ liệu.');
    }
  };

  if (!postDetail) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Đang tải chi tiết bài viết...</Text>
      </View>
    );
  }

  // Tạo dữ liệu cho Swiper
  const mediaData = [
    ...(postDetail.image_article || []).map((image) => ({
      type: 'image',
      url: image,
      key: `image-${image}`,
    })),
    postDetail.video_article
      ? {
          type: 'video',
          url: postDetail.video_article,
          key: `video-${postDetail.video_article}`,
        }
      : null,
  ].filter(Boolean);

  // Render từng item trong Swiper
  const renderMediaItem = (item) => (
    <View style={styles.mediaWrapper} key={item.key}>
      <Text style={styles.indexLabel}>
        {mediaData.findIndex((media) => media.key === item.key) + 1}/{mediaData.length}
      </Text>
      {item.type === 'image' ? (
        <Image source={{ uri: item.url }} style={styles.image} />
      ) : (
        <Video
          source={{ uri: item.url }}
          style={styles.video}
          controls
          resizeMode="cover"
          paused={true} // Tắt tự động phát
        />
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Nút Back */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Thông tin người đăng */}
      <View style={styles.userInfoContainer}>
        {/* Avatar */}
        <TouchableOpacity onPress={() => handleNavigateToProfile(postDetail.user_id)}>
          <Image source={{ uri: postDetail.user_avatar }} style={styles.avatar} />
        </TouchableOpacity>
        {/* Username */}
        <TouchableOpacity onPress={() => handleNavigateToProfile(postDetail.user_id)}>
          <Text style={styles.username}>{postDetail.username}</Text>
        </TouchableOpacity>
      </View>

      {/* Nội dung bài viết */}
      <Text style={styles.content}>{postDetail.content}</Text>

      {/* Swiper cho media */}
      {mediaData.length > 0 && (
        <View style={{ flex: 1, alignItems: 'center', marginBottom: 20 }}>
          <Swiper loop showsPagination width={width} height={300} autoplay={false}>
            {mediaData.map(renderMediaItem)}
          </Swiper>
        </View>
      )}

      {/* Thông tin tương tác */}
      <View style={styles.interactionContainer}>
        <View style={styles.interaction}>
          <Icon name="favorite-border" size={20} color="#000" />
          <Text>{postDetail.number_reaction} Lượt thích</Text>
        </View>
        <View style={styles.interaction}>
          <Icon name="chat-bubble-outline" size={20} color="#000" />
          <Text>{postDetail.number_comment} Bình luận</Text>
        </View>
      </View>

      {/* Bình luận */}
      <View style={styles.commentsContainer}>
        {(postDetail.comments || []).map((comment) => (
          <View key={`comment-${comment.comment_id}`} style={styles.comment}>
            {/* Avatar */}
            <TouchableOpacity onPress={() => handleNavigateToProfile(comment.user_id)}>
              <Image source={{ uri: comment.avatar_path }} style={styles.commentAvatar} />
            </TouchableOpacity>
            <View style={styles.commentContent}>
              {/* Username */}
              <TouchableOpacity onPress={() => handleNavigateToProfile(comment.user_id)}>
                <Text style={styles.commentUsername}>{comment.username}</Text>
              </TouchableOpacity>
              <Text>{comment.content}</Text>

              {/* Phản hồi bình luận */}
              {(comment.child_comments || []).map((child) => (
                <View key={`child-comment-${child.comment_id}`} style={styles.childComment}>
                  {/* Avatar */}
                  <TouchableOpacity onPress={() => handleNavigateToProfile(child.user_id)}>
                    <Image source={{ uri: child.avatar_path }} style={styles.commentAvatar} />
                  </TouchableOpacity>
                  <View style={styles.commentContent}>
                    {/* Username */}
                    <TouchableOpacity onPress={() => handleNavigateToProfile(child.user_id)}>
                      <Text style={styles.commentUsername}>{child.username}</Text>
                    </TouchableOpacity>
                    <Text>{child.content}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default PostDetailScreen;
