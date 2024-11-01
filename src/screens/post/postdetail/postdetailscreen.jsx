import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './postdetailstyle';

const PostDetailScreen = ({ route }) => {
  const { postDetail } = route.params; // Nhận dữ liệu bài viết từ route

  if (!postDetail) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Đang tải chi tiết bài viết...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Thông tin người đăng */}
      <View style={styles.userInfoContainer}>
        <Image source={{ uri: postDetail.user_avatar }} style={styles.avatar} />
        <Text style={styles.username}>{postDetail.username}</Text>
      </View>

      {/* Nội dung bài viết */}
      <Text style={styles.content}>{postDetail.content}</Text>

      {/* Hiển thị video nếu có */}
      {postDetail.video_article && (
        <Video
          source={{ uri: postDetail.video_article }}
          style={styles.video}
          resizeMode="cover"
          repeat={true}
        />
      )}

      {/* Hiển thị hình ảnh nếu có */}
      {postDetail.image_article.length > 0 && (
        <ScrollView horizontal style={styles.imageContainer}>
          {postDetail.image_article.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
        </ScrollView>
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
        <Text style={styles.commentsTitle}>Bình luận</Text>
        {postDetail.comments.map((comment) => (
          <View key={comment.comment_id} style={styles.comment}>
            <Image source={{ uri: comment.avatar_path }} style={styles.commentAvatar} />
            <View style={styles.commentContent}>
              <Text style={styles.commentUsername}>{comment.username}</Text>
              <Text>{comment.content}</Text>
              {/* Hiển thị phản hồi cho bình luận nếu có */}
              {comment.child_comments && comment.child_comments.map((child) => (
                <View key={child.comment_id} style={styles.childComment}>
                  <Image source={{ uri: child.avatar_path }} style={styles.commentAvatar} />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentUsername}>{child.username}</Text>
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
