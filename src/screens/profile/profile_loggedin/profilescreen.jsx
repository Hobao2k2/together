import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Modal, FlatList, Alert, TextInput } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { getUserInfoApi, updateProfileApi, uploadImageApi } from '../../../api/profileapi';
import { fetchPostDetail, getUserPostsApi, deleteArticleApi } from '../../../api/postapi';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';
import styles from './profilestyle';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ route, userId, navigation, setIsLoggedIn }) => {
  const userIdFromRoute = route?.params?.userId || userId;

  const [menuProfileVisible, setMenuProfileVisible] = useState(false); 
  const [logoutModalVisible, setLogoutModalVisible] = useState(false); 
  const [posts, setPosts] = useState([]);
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
  const [menuPostVisible, setMenuPostVisible] = useState(false); 
  const [activeMenuPostId, setActiveMenuPostId] = useState(null);

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      // Xóa token khỏi AsyncStorage
      await AsyncStorage.removeItem('userToken');
  
      // Cập nhật trạng thái đăng nhập
      setIsLoggedIn(false);
  
      Alert.alert('Đăng xuất', 'Bạn đã đăng xuất thành công!');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
    }
  };

  const [profile, setProfile] = useState({
    username: '',
    bios: '',
    avatar_path: '',
    wallpaper_path: '',
  });

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

  const handleUploadImage = async (imageType) => {
    const options = {
      mediaType: 'photo',
    };

    launchImageLibrary(options, async (response) => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setPhoto(selectedImage);

        try {
          await uploadImageApi(selectedImage, imageType);
          Alert.alert('Thành công', 'Ảnh đã được upload thành công!');
          fetchProfile(); 
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
      fetchProfile();
      setModalVisible(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin cá nhân:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin cá nhân');
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await getUserPostsApi(page, pageSize);
      const postsData = response.result;
  
      if (Array.isArray(postsData)) {
        setPosts((prevPosts) => {
          // Lọc các bài viết trùng lặp
          const uniquePosts = [...prevPosts, ...postsData].reduce((acc, current) => {
            // Kiểm tra xem bài viết có trùng với bài viết đã có trong acc không
            const exists = acc.find(item => item.id === current.id);
            if (!exists) acc.push(current);  // Nếu chưa có thì thêm vào
            return acc;
          }, []);
          
          return uniquePosts;
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy bài viết:', error);
    } finally {
      setPostsLoading(false);
    }
  };  

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
  
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      fetchUserPosts();
    }, [userIdFromRoute, page])
  );

  // Hàm xóa bài viết
  const handleDeletePost = async (postId) => {
    try {
      // Gọi API xóa bài viết
      await deleteArticleApi(postId);

      // Thông báo thành công
      Alert.alert("Thành công", "Bài viết đã được xóa!");

      // Cập nhật danh sách bài viết
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);

      // Thông báo lỗi
      Alert.alert("Lỗi", "Không thể xóa bài viết");
    } finally {
      // Đóng menu trong mọi trường hợp
      setMenuPostVisible(false);

      // Đóng modal xác nhận (nếu có)
      setConfirmDeleteVisible(false);
    }
  };


  // Hàm sửa bài viết
  const handleEditPost = (postId, navigation) => {
    const postToEdit = posts.find((post) => post.id === postId); 
  
    if (postToEdit) {
      navigation.navigate('EditPost', {
        articleId: postToEdit.id,
        userId: postToEdit.user_id,
        content: postToEdit.content,
        accessStatus: postToEdit.access_status || 'PRIVATE',
        images: postToEdit.image_article || [],
        video: postToEdit.video_article ? { uri: postToEdit.video_article } : null,
      });
    } else {
      Alert.alert("Lỗi", "Không thể tìm thấy thông tin bài viết.");
    }
  };
  

  // Hàm render bài viết
  const renderPostItem = ({ item }) => {
    // Kiểm tra xem menu của bài viết hiện tại có đang mở không
    const uniqueImages = Array.from(new Set(item.image_article || []));
    const mediaData = [
      ...uniqueImages.map((image) => ({
        type: 'image',
        url: image,
        key: `post-${item.id}-image-${image}`,
      })),
      item.video_article
        ? { type: 'video', url: item.video_article, key: `post-${item.id}-video` }
        : null,
    ].filter(Boolean);

    return (
      <TouchableOpacity onPress={() => handlePostPress(item.id, item.user_id)}>
        <View style={styles.postItemContainer}>
          {/* Header bài viết */}
          <View style={styles.postHeader}>
            <Image source={item.user_avatar ? { uri: item.user_avatar } : require('../../../../assets/image/avatar_icon.png')} style={styles.avatarSmall} />
            <Text style={styles.usernamePost}>{item.username}</Text>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setActiveMenuPostId(activeMenuPostId === item.id ? null : item.id)}
            >
              <Icon name="more-vert" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Menu Popup */}
          {activeMenuPostId === item.id && (
            <View style={styles.menupostContainer}>
              <TouchableOpacity
                style={styles.menupostOption}
                onPress={() => {
                  setActiveMenuPostId(null);
                  handleEditPost(item.id, navigation);
                }}
              >
                <Icon name="edit" size={24} color="#4a90e2" />
                <Text style={styles.menupostText}>Sửa bài viết</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menupostOption}
                onPress={() => {
                  setActiveMenuPostId(null);
                  handleDeletePost(item.id);
                }}
              >
                <Icon name="delete" size={24} color="#e74c3c" />
                <Text style={styles.menupostText}>Xóa bài viết</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Nội dung bài viết */}
          <Text style={styles.postContent}>{item.content}</Text>

          {/* Swiper cho media */}
          {mediaData.length > 0 && (
            <View style={{ height: 300, marginVertical: 10 }}>
              <Swiper style={{ height: 300 }} showsPagination loop>
                {mediaData.map((media) => (
                  <View key={media.key} style={styles.mediaWrapper}>
                    {media.type === 'image' ? (
                      <Image source={{ uri: media.url }} style={styles.postImage} />
                    ) : (
                      <Video
                        source={{ uri: media.url }}
                        style={styles.postVideo}
                        paused={playingVideoId !== media.key}
                        onLoadStart={() => setPlayingVideoId(media.key)}
                        resizeMode="cover"
                        controls
                      />
                    )}
                  </View>
                ))}
              </Swiper>
            </View>
          )}

          {/* Tương tác bài viết */}
          <View style={styles.postInteractionContainer}>
            <TouchableOpacity style={styles.interactionButton}>
              <Icon name="favorite-border" size={20} color="#000" />
              <Text style={styles.interactionText}>{item.likes} Likes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.interactionButton}>
              <Icon name="chat-bubble-outline" size={20} color="#000" />
              <Text style={styles.interactionText}>{item.comments} Comments</Text>
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
        keyExtractor={(item) => item.id || item.uniqueIdentifier}
        onEndReached={() => fetchUserPosts()}  s
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.wallpaperContainer}>
              <TouchableOpacity onPress={() => handleUploadImage('wallpaper')} style={styles.wallpaperOverlay}>
                <Image
                  source={profile.wallpaper_path ? { uri: profile.wallpaper_path } : require('../../../../assets/image/wallpaper.png')}
                  style={styles.wallpaper}
                />
                <Icon name="camera-alt" size={30} color="#fff" style={styles.wallpaperIcon} />
              </TouchableOpacity>
              <View style={styles.headerContainer}>
                <TouchableOpacity>
                  <Icon name="arrow-back" size={28} color="#fff" style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerText}>My Profile</Text>
                {/* Menu icon */}
                <TouchableOpacity
                  onPress={() => setMenuProfileVisible(!menuProfileVisible)} // Hiển thị menu khi nhấn vào icon
                  style={styles.menuIconContainer}
                >
                  <Icon name="more-vert" size={28} color="#fff" style={styles.menuIcon} />
                </TouchableOpacity>

                {/* Menu */}
                {menuProfileVisible && (
                  <View style={styles.menu}>
                    <TouchableOpacity
                      style={styles.menuOption}
                      onPress={() => {
                        setMenuProfileVisible(false); // Đóng menu
                        setLogoutModalVisible(true); // Hiển thị modal xác nhận đăng xuất
                      }}
                    >
                      <Icon name="logout" size={24} color="#e74c3c" />
                      <Text style={styles.menuOptionText}>Đăng xuất</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={styles.avatarWrapper}>
                <TouchableOpacity onPress={() => handleUploadImage('avatar')} style={styles.avatarContainer}>
                  <Image
                    source={profile.avatar_path ? { uri: profile.avatar_path } : require('../../../../assets/image/avatar_icon.png')}
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
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Xác nhận xóa bài viết</Text>
            <Text style={styles.modalMessage}>
              Bạn có chắc chắn muốn xóa bài viết này không?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setConfirmDeleteVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleDeletePost}
              >
                <Text style={styles.confirmButtonText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal xác nhận đăng xuất */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Xác nhận đăng xuất</Text>
            <Text style={styles.modalMessage}>
              Bạn có chắc chắn muốn đăng xuất không?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleLogout}
              >
                <Text style={styles.confirmButtonText}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ProfileScreen;