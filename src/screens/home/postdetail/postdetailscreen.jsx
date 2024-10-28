import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { fetchPostDetail } from '../../../api/postapi'; 
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './postdetailstyle';

const PostDetailScreen = ({ route, navigation }) => {
  const { article_id, owner_id } = route.params;
  const [postDetail, setPostDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostDetail();
  }, []);

  const getPostDetail = async () => {
    try {
      const response = await fetchPostDetail(article_id, owner_id); 
      setPostDetail(response.result);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết bài viết:', error);
      Alert.alert('Lỗi', 'Không thể lấy chi tiết bài viết');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!postDetail) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy bài viết.</Text>
      </View>
    );
  }

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <Image source={{ uri: item.avatar_path }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>{item.username}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header - User Info */}
      <View style={styles.headerContainer}>
        <Image source={{ uri: postDetail.user_avatar }} style={styles.avatar} />
        <Text style={styles.username}>{postDetail.username}</Text>
      </View>

      {/* Post Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>{postDetail.content}</Text>
      </View>

      {/* Post Media (Image or Video) */}
      {postDetail.image_article && postDetail.image_article.length > 0 ? (
        <FlatList
          data={postDetail.image_article}
          horizontal
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.postImage} />}
          keyExtractor={(item, index) => `${postDetail.id}-image-${index}`}
        />
      ) : postDetail.video_article ? (
        <Video
          source={{ uri: postDetail.video_article }}
          style={styles.postVideo}
          resizeMode="cover"
          controls
        />
      ) : (
        <Text style={styles.noMediaText}>Không có hình ảnh hoặc video</Text>
      )}

      {/* Interaction Buttons */}
      <View style={styles.interactionContainer}>
        <Icon name="favorite-border" size={24} color="#000" />
        <Text style={styles.interactionText}>{postDetail.number_reaction}</Text>
        <Icon name="chat-bubble-outline" size={24} color="#000" />
        <Text style={styles.interactionText}>{postDetail.number_comment}</Text>
      </View>

      {/* Comments Section */}
      <View style={styles.commentsSection}>
        <Text style={styles.commentsTitle}>Bình luận</Text>
        {postDetail.comments && postDetail.comments.length > 0 ? (
          <FlatList
            data={postDetail.comments}
            renderItem={renderCommentItem}
            keyExtractor={(item) => item.comment_id.toString()}
          />
        ) : (
          <Text style={styles.noCommentsText}>Chưa có bình luận.</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default PostDetailScreen;
