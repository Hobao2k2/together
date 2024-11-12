import React from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import styles from './postdetailstyle';

const { width } = Dimensions.get('window');

const PostDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { postDetail } = route.params;

  // Hàm chuyển sang màn hình Profile
  const handleNavigateToProfile = (targetUserId) => {
    if (!targetUserId) {
      console.error('Không tìm thấy userId để chuyển đến trang cá nhân.');
      return;
    }
    navigation.navigate('Profile', {
      userId: targetUserId, // Truyền userId của tài khoản
    });
  };

  if (!postDetail) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Đang tải chi tiết bài viết...</Text>
      </View>
    );
  }

  // Tạo dữ liệu cho Swiper với key duy nhất
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
        {/* Avatar - Điều hướng đến ProfileScreen */}
        <TouchableOpacity onPress={() => handleNavigateToProfile(postDetail.user_id)}>
          <Image source={{ uri: postDetail.user_avatar }} style={styles.avatar} />
        </TouchableOpacity>
        {/* Username - Điều hướng đến ProfileScreen */}
        <TouchableOpacity onPress={() => handleNavigateToProfile(postDetail.user_id)}>
          <Text style={styles.username}>{postDetail.username}</Text>
        </TouchableOpacity>
      </View>

      {/* Nội dung bài viết */}
      <Text style={styles.content}>{postDetail.content}</Text>

      {/* Swiper */}
      {mediaData.length > 0 && (
        <View style={{ flex: 1, alignItems: 'center', marginBottom: 20 }}>
          <Swiper
            loop
            showsPagination
            width={width}
            height={300}
            autoplay={false} // Tắt tự động phát
          >
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
            {/* Avatar - Điều hướng đến ProfileScreen */}
            <TouchableOpacity onPress={() => handleNavigateToProfile(comment.user_id)}>
              <Image source={{ uri: comment.avatar_path }} style={styles.commentAvatar} />
            </TouchableOpacity>
            <View style={styles.commentContent}>
              {/* Username - Điều hướng đến ProfileScreen */}
              <TouchableOpacity onPress={() => handleNavigateToProfile(comment.user_id)}>
                <Text style={styles.commentUsername}>{comment.username}</Text>
              </TouchableOpacity>
              <Text>{comment.content}</Text>

              {/* Hiển thị phản hồi cho bình luận nếu có */}
              {(comment.child_comments || []).map((child) => (
                <View key={`child-comment-${child.comment_id}`} style={styles.childComment}>
                  {/* Avatar của phản hồi */}
                  <TouchableOpacity onPress={() => handleNavigateToProfile(child.user_id)}>
                    <Image source={{ uri: child.avatar_path }} style={styles.commentAvatar} />
                  </TouchableOpacity>
                  <View style={styles.commentContent}>
                    {/* Username của phản hồi */}
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
