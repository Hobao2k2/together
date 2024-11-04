import React from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation } from '@react-navigation/native';
import styles from './postdetailstyle';

const { width } = Dimensions.get('window');

const PostDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { postDetail } = route.params;

  if (!postDetail) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Đang tải chi tiết bài viết...</Text>
      </View>
    );
  }

  // Chuẩn bị dữ liệu cho carousel với `key` duy nhất
  const mediaData = [
    ...postDetail.image_article.map((image, index) => ({
      type: 'image',
      url: image,
      index: `${index + 1}`, // Sử dụng `index` duy nhất cho mỗi ảnh
    })),
    postDetail.video_article ? {
      type: 'video',
      url: postDetail.video_article,
      index: `${postDetail.image_article.length + 1}`, // Sử dụng `index` duy nhất cho video
    } : null,
  ].filter(Boolean);

  const renderMediaItem = ({ item }) => (
    <View style={styles.mediaWrapper}>
      <Text style={styles.indexLabel}>{item.index}/{mediaData.length}</Text>
      {item.type === 'image' ? (
        <Image source={{ uri: item.url }} style={styles.image} />
      ) : (
        <Video source={{ uri: item.url }} style={styles.video} controls resizeMode="cover" />
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
        <Image source={{ uri: postDetail.user_avatar }} style={styles.avatar} />
        <Text style={styles.username}>{postDetail.username}</Text>
      </View>

      {/* Nội dung bài viết */}
      <Text style={styles.content}>{postDetail.content}</Text>

      {/* Carousel */}
      {mediaData.length > 0 && (
        <View style={{ flex: 1, alignItems: 'center', marginBottom: 20 }}>
          <Carousel
            loop
            width={width}
            height={300}
            data={mediaData}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => renderMediaItem({ item })}
          />
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
        {postDetail.comments.map((comment, index) => (
          <View key={`${comment.comment_id}-${index}`} style={styles.comment}>
            <Image source={{ uri: comment.avatar_path }} style={styles.commentAvatar} />
            <View style={styles.commentContent}>
              <Text style={styles.commentUsername}>{comment.username}</Text>
              <Text>{comment.content}</Text>
              
              {/* Hiển thị phản hồi cho bình luận nếu có */}
              {comment.child_comments && comment.child_comments.map((child, childIndex) => (
                <View key={`${child.comment_id}-${childIndex}`} style={styles.childComment}>
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
