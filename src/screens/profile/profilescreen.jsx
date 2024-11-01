import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Modal, FlatList, Alert, TextInput } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { getUserInfoApi, updateProfileApi, uploadImageApi } from '../../api/profileapi';
import { fetchPostDetail, getUserPostsApi, deleteArticleApi } from '../../api/postapi';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import styles from './profilestyle';

const ProfileScreen = ({ route, userId, navigation }) => {
  const userIdFromRoute = route?.params?.userId || userId;

  const [posts, setPosts] = useState([]); // State để lưu danh sách bài viết
  const [postsLoading, setPostsLoading] = useState(true);
  const [page, setPage] = useState(0);  
  const [pageSize] = useState(10);  
  const [photo, setPhoto] = useState(null);
  const [editableProfile, setEditableProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const [profile, setProfile] = useState({
    username: '',
    bios: '',
    avatar_path: '',
    wallpaper_path: '',
  });

  // Hàm để tải lại thông tin từ API
  const fetchProfile = async () => {
    try {
      const response = await getUserInfoApi(userIdFromRoute);
      const userInfo = response.result;
      setProfile({
        username: userInfo.username,
        bios: userInfo.bios || '',
        avatar_path: userInfo.avatar_path || '',
        wallpaper_path: userInfo.wallpaper_path || '',
        phone: userInfo.phone || '',
        gender: userInfo.gender || '',
        dob: userInfo.dob || '',
      });
      setEditableProfile({
        username: userInfo.username,
        bios: userInfo.bios || '',
        phone: userInfo.phone || '',
        gender: userInfo.gender || '',
        dob: userInfo.dob || '',
      });
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm để upload ảnh
  const handleUploadImage = async (imageType) => {
    const options = {
      mediaType: 'photo',
    };

    launchImageLibrary(options, async (response) => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setPhoto(selectedImage);

        try {
          await uploadImageApi(selectedImage, imageType);  // Truyền type vào
          Alert.alert('Thành công', 'Ảnh đã được upload thành công!');
          fetchProfile();  // Làm mới thông tin sau khi upload ảnh
        } catch (error) {
          const errorMessage = error.response ? error.response.data : error.message;
          Alert.alert('Lỗi', `Upload ảnh thất bại! Lỗi: ${errorMessage}`);
          console.error('Upload failed:', error);
        }
      } else {
        Alert.alert('Thông báo', 'Bạn chưa chọn ảnh nào.');
      }
    });
  };

  // Hàm để cập nhật thông tin cá nhân
  const handleUpdateProfile = async () => {
    try {
      const updatedProfileData = {
        username: editableProfile.username,
        phone: editableProfile.phone,
        gender: editableProfile.gender,
        bios: editableProfile.bios,
        dob: editableProfile.dob,
      };

      await updateProfileApi(updatedProfileData);
      Alert.alert('Thành công', 'Thông tin cá nhân đã được cập nhật');
      fetchProfile();  // Làm mới thông tin sau khi cập nhật thành công
      setModalVisible(false);  // Đóng modal sau khi cập nhật
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin cá nhân:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin cá nhân');
    }
  };

  // Hàm lấy danh sách bài viết từ API
  const fetchUserPosts = async () => {
    try {
      const response = await getUserPostsApi(page, pageSize);
      const postsData = response.result; // Truy cập vào result trong API

      if (Array.isArray(postsData)) {
        setPosts((prevPosts) => [...prevPosts, ...postsData]); // Thêm vào danh sách hiện tại
      }
    } catch (error) {
      console.error('Lỗi khi lấy bài viết:', error);
    } finally {
      setPostsLoading(false);
    }
  };

    // Làm mới dữ liệu khi màn hình Profile được focus
    useFocusEffect(
      useCallback(() => {
        fetchProfile();
        fetchUserPosts();
      }, [userIdFromRoute, page])
    );

  const handlePostPress = async (articleId, ownerId) => {
    try {
      const articleDetail = await fetchPostDetail(articleId, ownerId);
      if (articleDetail.success) {
        navigation.navigate('PostDetail', { postDetail: articleDetail.data });
      } else {
        Alert.alert('Lỗi', articleDetail.error);
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết bài viết:', error);
      Alert.alert('Lỗi', 'Không thể lấy chi tiết bài viết');
    }
  };

  // Hàm xóa bài viết
  const handleDeletePost = async () => {
    try {
      await deleteArticleApi(selectedArticleId);
      Alert.alert("Thành công", "Bài viết đã được xóa!");
      setPosts(posts.filter(post => post.id !== selectedArticleId));
      setConfirmDeleteVisible(false);
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
      Alert.alert("Lỗi", "Không thể xóa bài viết");
    }
  };
  // Hàm kích hoạt khi một video bắt đầu tải
  const handlePlay = (videoId) => {
    setPlayingVideoId(videoId);  // Cập nhật trạng thái video đang phát
  };

  // Hàm render từng bài viết
  const renderPostItem = ({ item }) => {
    const hasImages = item.image_article.length > 0;  // Kiểm tra có hình ảnh không
    const hasVideo = item.video_article !== null;     // Kiểm tra có video không

    return (
      <TouchableOpacity onPress={() => handlePostPress(item.id, item.user_id)}>
        <View style={styles.postItemContainer}>
          {/* Thông tin người đăng */}
          <View style={styles.postHeader}>
            <Image source={{ uri: item.user_avatar }} style={styles.avatarSmall} />
            <Text style={styles.usernamePost}>{item.username}</Text>

            {/* Nút xóa */}
            <TouchableOpacity
              onPress={() => {
                setSelectedArticleId(item.id);
                setConfirmDeleteVisible(true);
              }}
              style={styles.menuButton}
            >
              <Icon name="delete" size={24} color="#e74c3c" />
            </TouchableOpacity>

            {/* Nút sửa */}
            <TouchableOpacity
              onPress={() => navigation.navigate('EditPostScreen', {
                articleId: item.id,
                userId: item.user_id,
                content: item.content,
                accessStatus: item.access_status,
                images: item.image_article,
                video: item.video_article,
              })}
              style={styles.menuButton}
            >
              <Icon name="edit" size={24} color="#4a90e2" />
            </TouchableOpacity>
          </View>

          {/* Nội dung bài viết */}
          <Text style={styles.postContent}>{item.content}</Text>

          {/* Nếu có video, hiển thị video */}
          {hasVideo && (
          <Video
            source={{ uri: item.video_article }}
            paused={playingVideoId !== item.id}  // Dừng video nếu không phải video hiện tại
            onLoadStart={() => handlePlay(item.id)}  // Bắt đầu phát video
            style={styles.postVideo}
            resizeMode="cover"
          />
          )}

          {/* Nếu có nhiều hình ảnh, hiển thị thanh cuộn ngang */}
          {hasImages && (
            <FlatList
              horizontal
              data={item.image_article}
              renderItem={({ item }) => <Image source={{ uri: item }} style={styles.postImage} />}
              keyExtractor={(image, index) => `${item.id}-image-${index}`}
            />
          )}

          {/* Nếu không có hình ảnh và video */}
          {!hasImages && !hasVideo && (
            <Text style={styles.noMediaText}>Không có hình ảnh hoặc video</Text>
          )}

          {/* Thêm các nút tương tác */}
          <View style={styles.postInteractionContainer}>
            <TouchableOpacity>
              <Icon name="favorite-border" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="chat-bubble-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        columnWrapperStyle={styles.columnWrapper}
        onEndReached={() => setPage(page + 1)}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.wallpaperContainer}>
              <TouchableOpacity onPress={() => handleUploadImage('wallpaper')} style={styles.wallpaperOverlay}>
                <Image
                  source={profile.wallpaper_path ? { uri: profile.wallpaper_path } : require('../../../assets/image/wallpaper.png')}
                  style={styles.wallpaper}
                />
                <Icon name="camera-alt" size={30} color="#fff" style={styles.wallpaperIcon} />
              </TouchableOpacity>
              <View style={styles.headerContainer}>
                <TouchableOpacity>
                  <Icon name="arrow-back" size={28} color="#fff" style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerText}>My Profile</Text>
                <TouchableOpacity>
                  <Icon name="more-vert" size={28} color="#fff" style={styles.menuIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.avatarWrapper}>
                <TouchableOpacity onPress={() => handleUploadImage('avatar')} style={styles.avatarContainer}>
                  <Image
                    source={profile.avatar_path ? { uri: profile.avatar_path } : require('../../../assets/image/avatar_icon.png')}
                    style={styles.avatar}
                  />
                  <Icon name="camera-alt" size={25} color="#fff" style={styles.avatarIcon} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
            <View style={styles.profileContainer}>
              <Text style={styles.username}>{profile.username}</Text>
              <Text style={styles.bio}>{profile.bios}</Text>
              <TouchableOpacity style={styles.updateProfileButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.updateProfileButtonText}>Cập nhật thông tin</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListFooterComponent={postsLoading ? <ActivityIndicator size="large" color="#000" /> : null}
      />

      {/* Modal cập nhật thông tin cá nhân */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Cập nhật thông tin cá nhân</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Tên người dùng"
              value={editableProfile.username}
              onChangeText={(text) => setEditableProfile({ ...editableProfile, username: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Số điện thoại"
              value={editableProfile.phone}
              onChangeText={(text) => setEditableProfile({ ...editableProfile, phone: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Giới tính"
              value={editableProfile.gender}
              onChangeText={(text) => setEditableProfile({ ...editableProfile, gender: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Bios"
              value={editableProfile.bios}
              onChangeText={(text) => setEditableProfile({ ...editableProfile, bios: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Ngày sinh (YYYY-MM-DD)"
              value={editableProfile.dob}
              onChangeText={(text) => setEditableProfile({ ...editableProfile, dob: text })}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleUpdateProfile}>
              <Text style={styles.buttonText}>Cập nhật</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
            {/* Modal xác nhận xóa bài viết */}
            <Modal
        animationType="fade"
        transparent={true}
        visible={confirmDeleteVisible}
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.confirmDeleteContainer}>
            <Text style={styles.confirmDeleteText}>Bạn có chắc chắn muốn xóa bài viết này không?</Text>
            <View style={styles.confirmDeleteButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setConfirmDeleteVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={handleDeletePost}
              >
                <Text style={styles.confirmDeleteButtonText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ProfileScreen;
