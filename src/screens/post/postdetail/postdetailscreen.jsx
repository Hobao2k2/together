import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, Image, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity, Modal } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getUserCredentials } from '../../../api/profileapi';
import Swiper from 'react-native-swiper';
import { fetchPostDetail } from '../../../api/postapi';
import { fetchCommentsApi } from '../../../api/comment&like';
import { likeArticleApi, postCommentApi, editCommentApi, deleteCommentApi } from '../../../api/comment&like';
import Toast from 'react-native-toast-message';  
import styles from './postdetailstyle';

const { width } = Dimensions.get('window');

const PostDetailScreen = ({ route, navigation }) => {
  const { articleId, ownerId } = route.params; // Lấy articleId và ownerId từ params

  console.log("data log:", articleId, ownerId);

  const [postDetail, setPostDetail] = useState(null); // Dữ liệu bài viết
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0); // Tổng số bình luận
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [offset, setOffset] = useState(0); // Vị trí bắt đầu cho page
  const [newComment, setNewComment] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [visibleChildComments, setVisibleChildComments] = useState({});
  const [visibleMenuId, setVisibleMenuId] = useState(null);


  const [isLiked, setIsLiked] = useState(false);
  const [reaction, setReaction] = useState(0); 
  const [activeMenuCommentId, setActiveMenuCommentId] = useState();

  // State cho modal chỉnh sửa
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [editedComment, setEditedComment] = useState('');
  
  // State cho modal xác nhận xóa
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // Lấy chi tiết bài viết từ API
  const fetchPostData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchPostDetail(articleId, ownerId); // Gọi API lấy chi tiết bài viết
      if (response.success) {
        setPostDetail(response.data);
        setReaction(response.data.reaction); // Cập nhật trạng thái like
        setLikes(response.data.number_reaction);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể tải chi tiết bài viết.',
        });
        navigation.goBack(); // Quay lại màn hình trước nếu không tải được dữ liệu
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu bài viết:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể tải bài viết. Vui lòng thử lại sau!',
      });
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const COMMENTS_PAGE_SIZE = 10;

  // Hàm gọi API lấy bình luận
  const fetchComments = async (reset = false) => {
    setIsLoadingComments(true);
    try {
      const response = await fetchCommentsApi(articleId, reset ? 0 : offset, COMMENTS_PAGE_SIZE);
      const { res, total_comment } = response.result;

      if (reset) {
        setComments(res); // Reset danh sách bình luận nếu là lần đầu tải
        setTotalComments(total_comment || 0); // Cập nhật tổng số bình luận
        setOffset(COMMENTS_PAGE_SIZE); // Đặt lại offset sau khi reset
      } else {
        setComments((prevComments) => [...prevComments, ...res]); // Thêm dữ liệu mới vào danh sách cũ
        setOffset((prevOffset) => prevOffset + COMMENTS_PAGE_SIZE); // Cập nhật offset khi tải thêm
      }

      setTotalComments(total_comment || 0); // Cập nhật tổng số bình luận ở cuối hàm
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bình luận:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };
    
  console.log('postdata',postDetail);
  console.log('comment',comments);


  useFocusEffect(
    useCallback(() => {
      console.log('articleId:', articleId);
      console.log('ownerId:', ownerId);
      fetchPostData(); // Gọi API để lấy dữ liệu bài viết mỗi khi màn hình này được focus
      fetchComments();
      setNewComment('');
    }, [articleId, ownerId])
  );  

  // Hàm xử lý Like/Bỏ like bài viết
  const handleLikeArticle = async () => {
    try {
      const { userId } = await getUserCredentials(); // Lấy thông tin người dùng
      if (!userId) {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể lấy thông tin người dùng.',
        });
        return;
      }
  
      // Đảo trạng thái like
      const newReaction = reaction === 0 ? 1 : 0;
  
      // Gọi API cập nhật like
      const response = await likeArticleApi(userId, articleId, newReaction);
  
      // Log phản hồi từ API
      console.log('Phản hồi từ API sau khi like/bỏ like:', response);
  
      // Cập nhật trạng thái cục bộ
      setReaction(newReaction);
      setLikes((prevLikes) => prevLikes + (newReaction === 1 ? 1 : -1)); // Cập nhật số lượt like
  
      // Thông báo thành công
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: newReaction === 1 ? 'Đã thích bài viết.' : 'Đã bỏ thích bài viết.',
      });
    } catch (error) {
      console.error('Lỗi khi like/bỏ like bài viết:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể thực hiện thao tác thích bài viết.',
      });
    }
  };  
  
  const handlePostComment = async () => {
    if (!newComment.trim()) {
      Toast.show({
        type: 'info',
        text1: 'Thông báo',
        text2: 'Vui lòng nhập nội dung bình luận.',
      });
      return;
    }
  
    try {
      const { userId } = await getUserCredentials();
      if (!userId) {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể lấy thông tin người dùng.',
        });
        return;
      }
  
      const data = {
        article_id: articleId,
        content: newComment,
        user_id: userId,
      };
  
      if (replyToCommentId) {
        data.parent_comment_id = replyToCommentId;
      }
  
      console.log("comment log:", data);
  
      const response = await postCommentApi(data.article_id, data.content, data.user_id, data.parent_comment_id);
      console.log("API Response:", response);
  
      if (response.code === 1000) {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Bình luận đã được đăng.',
        });
  
        setNewComment('');
        setReplyToCommentId(null);
  
        // Gọi lại fetchComments để cập nhật danh sách
        fetchComments(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: response.result || 'Không thể đăng bình luận. Vui lòng thử lại sau!',
        });
      }
    } catch (error) {
      console.error("Lỗi khi đăng bình luận:", error.message);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể đăng bình luận. Vui lòng thử lại sau!',
      });
    }
  };    

  const handleReplyClick = (commentId) => {
    // Lưu commentId vào replyToCommentId khi người dùng bấm "Trả lời"
    setReplyToCommentId(commentId);
  
    // Đảo trạng thái hiển thị bình luận con như cũ
    setVisibleChildComments((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],  // Đảo trạng thái hiển thị của bình luận con
    }));
  };     
  
  // Hàm sửa bình luận
  const handleEditComment = async (commentId, newContent) => {
    try {
      const { userId, username, avatar } = await getUserCredentials(); // Lấy thông tin người dùng
      if (!userId) {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể lấy thông tin người dùng.',
        });
        return;
      }
  
      await editCommentApi(postDetail.id, newContent, commentId, userId, username, avatar); // Gửi thông tin người dùng khi sửa bình luận
  
      setComments(
        comments.map((comment) =>
          comment.comment_id === commentId ? { ...comment, content: newContent } : comment
        )
      );
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Bình luận đã được sửa.',
      });
      fetchComments(true);
    } catch (error) {
      console.error('Lỗi khi sửa bình luận:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể sửa bình luận.',
      });
    }
  };  

  // Hàm xóa bình luận
  const handleDeleteComment = async (commentId) => {
    try {
      const { userId, username, avatar } = await getUserCredentials(); // Lấy thông tin người dùng
      if (!userId) {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể lấy thông tin người dùng.',
        });
        return;
      }
  
      await deleteCommentApi(postDetail.id, commentId, userId); // Gửi thông tin người dùng khi xóa bình luận
  
      setComments(comments.filter((comment) => comment.comment_id !== commentId));
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Bình luận đã được xóa.',
      });
      fetchComments(true);
    } catch (error) {
      console.error('Lỗi khi xóa bình luận:', error.message);
      Toast.show({
        type: 'error',
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
        text1: 'Lỗi',
        text2: 'Không thể thực hiện điều hướng do lỗi dữ liệu.',
      });
    }
  };

  // Hàm xử lý mở/đóng menu cho bình luận
  const handleToggleMenu = (commentId) => {
    if (visibleMenuId === commentId) {
      setVisibleMenuId(null); // Ẩn menu nếu đã mở
    } else {
      setVisibleMenuId(commentId); // Hiển thị menu
    }
  };  

  // Modal chỉnh sửa bình luận
  const openEditModal = (comment) => {
    setCommentToEdit(comment);
    setEditedComment(comment.content);
    setIsEditModalVisible(true);
  };

  // Modal xác nhận xóa bình luận
  const openDeleteModal = (comment) => {
    setCommentToDelete(comment);
    setIsDeleteModalVisible(true);
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Nút Back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* Thông tin người đăng */}
        <View style={styles.userInfoContainer}>
          <TouchableOpacity onPress={() => handleNavigateToProfile(postDetail.user_id)}>
            <Image style={styles.avatar}
            source={ postDetail.user_avatar ? { uri: postDetail.user_avatar } : require('../../../../assets/image/avatar_icon.png')} />
          </TouchableOpacity>
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
            <Icon
              name={reaction === 1 ? 'favorite' : 'favorite-border'}
              size={20}
              color={reaction === 1 ? '#f00' : '#000'}
            />
            <Text style={styles.interactionContent}>{likes} Lượt thích</Text>
          </TouchableOpacity>
          <View style={styles.interaction}>
            <Icon name="chat-bubble-outline" size={20} color="#000" />
            <Text style={styles.interactionContent}>{totalComments} Bình luận</Text>
          </View>
        </View>

        {/* Danh sách bình luận */}
        <View style={styles.commentsContainer}>
        {comments.map((comment) => (
          <View key={comment.comment_id} style={styles.comment}>
            <View style={styles.commentHeader}>
              <TouchableOpacity onPress={() => handleNavigateToProfile(comment.user_id)}>
                <Image
                  source={
                    comment.avatar_path
                      ? { uri: comment.avatar_path }
                      : require('../../../../assets/image/avatar_icon.png')
                  }
                  style={styles.commentAvatar}
                />
              </TouchableOpacity>

              <View style={styles.usernameMenuContainer}>
          <TouchableOpacity onPress={() => handleNavigateToProfile(comment.user_id)}>
            <Text style={styles.commentUsername}>{comment.username}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => handleToggleMenu(comment.comment_id)}
          >
            <Icon name="more-vert" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Sửa/Xóa */}
      {visibleMenuId === comment.comment_id && (
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              handleToggleMenu(null); // Đóng menu
              openEditModal(comment);
            }}
          >
            <Icon name="edit" size={24} color="#4a90e2" />
            <Text style={styles.menuText}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              handleToggleMenu(null); // Đóng menu
              openDeleteModal(comment);
            }}
          >
            <Icon name="delete" size={24} color="#e74c3c" />
            <Text style={styles.menuText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      )}

            {/* Nội dung bình luận */}
            <View style={styles.commentTextContainer}>
              <Text style={styles.commentText}>{comment.content}</Text>
            </View>

            {/* Nút "Trả lời" cho bình luận */}
            <TouchableOpacity style={styles.replyButton} onPress={() => handleReplyClick(comment.comment_id)}>
              <Text style={styles.replyButtonText}>Trả lời</Text>
            </TouchableOpacity>

            {/* Danh sách bình luận con */}
            {visibleChildComments[comment.comment_id] && comment.child_comments?.length > 0 && (
              <View style={styles.childCommentsContainer}>
                {comment.child_comments.map((childComment) => (
                  <View key={childComment.comment_id} style={styles.childComment}>
                    <View style={styles.commentHeader}>
                      <TouchableOpacity onPress={() => handleNavigateToProfile(childComment.user_id)}>
                        <Image
                          source={
                            childComment.avatar_path
                              ? { uri: childComment.avatar_path }
                              : require('../../../../assets/image/avatar_icon.png')
                          }
                          style={styles.commentAvatar}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleNavigateToProfile(childComment.user_id)}>
                        <Text style={styles.commentUsername}>{childComment.username}</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Nội dung bình luận con */}
                    <Text style={styles.commentText}>{childComment.content}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Hiển thị loading khi tải thêm bình luận */}
        {isLoadingComments && <ActivityIndicator size="small" color="#000" />}
      </View>

      </ScrollView>
      
      {/* Thêm bình luận */}
      {replyToCommentId && (
        <Text style={styles.replyingToText}>Đang trả lời bình luận...</Text>
      )}

      {/* Ô nhập bình luận */}
      <View style={styles.addCommentContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Viết bình luận..."
          value={newComment}
          onChangeText={setNewComment}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={handlePostComment} style={styles.commentButton}>
          <Text style={styles.commentButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
  
      {/* Modal chỉnh sửa bình luận */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              value={editedComment}
              onChangeText={setEditedComment}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setIsEditModalVisible(false);
                  setEditedComment('');
                }}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  handleEditComment(commentToEdit.comment_id, editedComment);
                  setIsEditModalVisible(false);
                }}
              >
                <Text>Cập nhật</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  
      {/* Modal xác nhận xóa bình luận */}
      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>Bạn có chắc chắn muốn xóa bình luận này?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setIsDeleteModalVisible(false);
                }}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  handleDeleteComment(commentToDelete.comment_id);
                  setIsDeleteModalVisible(false);
                }}
              >
                <Text>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );  
};

export default PostDetailScreen;