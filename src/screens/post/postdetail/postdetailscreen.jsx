import React from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { getUserCredentials } from '../../../api/profileapi';
import Toast from 'react-native-toast-message';  
import styles from './postdetailstyle';

const { width } = Dimensions.get('window');

const PostDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { postDetail } = route.params;

  const [likes, setLikes] = useState(postDetail.number_reaction);
  const [comments, setComments] = useState(postDetail.comments || []);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false); // Kiểm tra bài viết đã được like hay chưa

  // Hàm xử lý Like/Bỏ like bài viết
  const handleLikeArticle = async () => {
    try {
      const { userId } = await getUserCredentials();
      const liked = isLiked ? 0 : 1;
      await likeArticleApi(userId, postDetail.article_id, liked);
      setIsLiked(!isLiked);
      setLikes(likes + (liked ? 1 : -1));
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Thành công',
        text2: isLiked ? 'Đã bỏ thích bài viết.' : 'Đã thích bài viết.',
      });
    } catch (error) {
      console.error('Lỗi khi like bài viết:', error.message);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Lỗi',
        text2: 'Không thể thực hiện thao tác thích bài viết.',
      });
    }
  };

  // Hàm đăng bình luận
  const handlePostComment = async () => {
    if (!newComment.trim()) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Thông báo',
        text2: 'Vui lòng nhập nội dung bình luận.',
      });
      return;
    }

    try {
      const { userId } = await getUserCredentials();
      const response = await postCommentApi(postDetail.article_id, newComment, userId);
      setComments([...comments, response]); // Thêm bình luận mới vào danh sách
      setNewComment(''); // Xóa nội dung input
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Thành công',
        text2: 'Bình luận đã được đăng.',
      });
    } catch (error) {
      console.error('Lỗi khi đăng bình luận:', error.message);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Lỗi',
        text2: 'Không thể đăng bình luận.',
      });
    }
  };

  // Hàm sửa bình luận
  const handleEditComment = async (commentId, newContent) => {
    try {
      await editCommentApi(postDetail.article_id, newContent, commentId);
      setComments(
        comments.map((comment) =>
          comment.comment_id === commentId ? { ...comment, content: newContent } : comment
        )
      );
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Thành công',
        text2: 'Bình luận đã được sửa.',
      });
    } catch (error) {
      console.error('Lỗi khi sửa bình luận:', error.message);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Lỗi',
        text2: 'Không thể sửa bình luận.',
      });
    }
  };

  // Hàm xóa bình luận
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentApi(postDetail.article_id, commentId);
      setComments(comments.filter((comment) => comment.comment_id !== commentId));
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Thành công',
        text2: 'Bình luận đã được xóa.',
      });
    } catch (error) {
      console.error('Lỗi khi xóa bình luận:', error.message);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Lỗi',
        text2: 'Không thể xóa bình luận.',
      });
    }
  };

  // Hàm chuyển sang màn hình Profile
  const handleNavigateToProfile = async (targetUserId) => {
    if (!targetUserId) {
      console.error('Không tìm thấy userId để chuyển đến trang cá nhân.');
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Lỗi',
        text2: 'Không thể chuyển đến trang cá nhân do thiếu thông tin người dùng.',
      });
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
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Lỗi',
        text2: 'Không thể thực hiện điều hướng do lỗi dữ liệu.',
      });
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
        <TouchableOpacity style={styles.interaction} onPress={handleLikeArticle}>
          <Icon name={isLiked ? 'favorite' : 'favorite-border'} size={20} color="#f00" />
          <Text>{likes} Lượt thích</Text>
        </TouchableOpacity>
        <View style={styles.interaction}>
          <Icon name="chat-bubble-outline" size={20} color="#000" />
          <Text>{comments.length} Bình luận</Text>
        </View>
      </View>

      {/* Thêm bình luận */}
      <View style={styles.addCommentContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Viết bình luận..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handlePostComment} style={styles.commentButton}>
          <Text>Gửi</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách bình luận */}
      <View style={styles.commentsContainer}>
        {comments.map((comment) => (
          <View key={comment.comment_id} style={styles.comment}>
            <TouchableOpacity onPress={() => handleNavigateToProfile(comment.user_id)}>
              <Image source={{ uri: comment.avatar_path }} style={styles.commentAvatar} />
            </TouchableOpacity>
            <View style={styles.commentContent}>
              <TouchableOpacity onPress={() => handleNavigateToProfile(comment.user_id)}>
                <Text style={styles.commentUsername}>{comment.username}</Text>
              </TouchableOpacity>
              <Text>{comment.content}</Text>
              <TouchableOpacity onPress={() => handleDeleteComment(comment.comment_id)}>
                <Text style={styles.deleteCommentText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default PostDetailScreen;
