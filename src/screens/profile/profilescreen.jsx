import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Modal, FlatList, Alert, TextInput } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { getUserInfoApi, updateProfileApi, uploadImageApi } from '../../api/profileapi';
import { fetchPostDetail, getUserPostsApi, deleteArticleApi } from '../../api/postapi';
import { 
  checkRelationshipApi,       // Kiểm tra quan hệ giữa 2 tài khoản
  sendFriendRequestApi,       // Gửi yêu cầu kết bạn
  acceptFriendRequestApi,     // Chấp nhận lời mời kết bạn
  rejectFriendRequestApi,     // Từ chối lời mời kết bạn
  blockUserApi,               // Block tài khoản
  unfriendUserApi             // Hủy kết bạn
} from '../../api/friendapi'; 

import Icon from 'react-native-vector-icons/MaterialIcons';
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';
import styles from './profilestyle';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ route, userId, navigation, setIsLoggedIn }) => {
  const userIdFromRoute = route?.params?.userId || userId;
  const isCurrentUser = userId === userIdFromRoute; // Kiểm tra xem có phải trang của chính mình không

  const [menuProfileVisible, setMenuProfileVisible] = useState(false); 
  const [logoutModalVisible, setLogoutModalVisible] = useState(false); 
  const [posts, setPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true); 
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
  const [relationshipStatus, setRelationshipStatus] = useState(null); 
  const [loadingRelationship, setLoadingRelationship] = useState(false);
  const [menuFriendVisible, setMenuFriendVisible] = useState(false); // Hiển thị menu bạn bè
  const [menuBlockVisible, setMenuBlockVisible] = useState(false); // Hiển thị menu block


  const [profile, setProfile] = useState({
    username: '',
    bios: '',
    avatar_path: '',
    wallpaper_path: '',
  });

  const fetchProfile = async () => {
    setLoading(true); // Đặt trạng thái đang tải
    try {
      const response = await getUserInfoApi(userIdFromRoute);
  
      if (response && response.result) {
        const userInfo = response.result;
  
        setProfile({
          username: userInfo.username || 'Chưa đặt tên',
          bios: userInfo.bios || '',
          avatar_path: userInfo.avatar_path || '',
          wallpaper_path: userInfo.wallpaper_path || '',
          phone: userInfo.phone || '',
          gender: userInfo.gender || '',
          dob: userInfo.dob || '',
        });
  
        setEditableProfile({
          username: userInfo.username || 'Chưa đặt tên',
          bios: userInfo.bios || '',
          phone: userInfo.phone || '',
          gender: userInfo.gender || '',
          dob: userInfo.dob || '',
        });
      } else {
        console.warn('API không trả về kết quả hồ sơ hợp lệ');
        setProfile({
          username: 'Không xác định',
          bios: '',
          avatar_path: '',
          wallpaper_path: '',
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin hồ sơ.');
    } finally {
      setLoading(false); // Dừng trạng thái đang tải
    }
  };  

  // Kiểm tra quan hệ giữa 2 tài khoản
  const fetchRelationshipStatus = async () => {
    try {
      setLoadingRelationship(true);
      const response = await checkRelationshipApi(userId, userIdFromRoute);
      const { result } = response;
  
      switch (result) {
        case 'FRIEND':
          setRelationshipStatus('friends');
          break;
        case 'REQUEST':
          setRelationshipStatus('pending'); // Người dùng đã gửi yêu cầu kết bạn
          break;
        case 'REQUESTED':
          setRelationshipStatus('requested'); // Người dùng nhận được yêu cầu kết bạn
          break;
        case 'BLOCK':
          setRelationshipStatus('blocked_by_sender'); // Người dùng đã block tài khoản này
          break;
        case 'BLOCKED':
          setRelationshipStatus('blocked'); // Người dùng bị block bởi tài khoản này
          break;
        default:
          setRelationshipStatus('not_friends'); // Không có quan hệ
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra quan hệ:', error);
      setRelationshipStatus(null); // Trường hợp lỗi
    } finally {
      setLoadingRelationship(false);
    }
  };  

  const fetchUserPosts = async () => {
    if (postsLoading || !hasMorePosts) return; // Kiểm tra trạng thái tải và còn bài viết mới không
    setPostsLoading(true);
  
    try {
      const response = await getUserPostsApi(userIdFromRoute, page, pageSize);
  
      if (response && Array.isArray(response.result)) {
        const postsData = response.result;
  
        setPosts((prevPosts) => [
          ...prevPosts,
          ...postsData.filter((post) => !prevPosts.some((p) => p.id === post.id)),
        ]);
  
        // Kiểm tra xem còn bài viết mới không
        if (postsData.length < pageSize) {
          setHasMorePosts(false); // Không còn bài viết mới
        } else {
          setPage((prevPage) => prevPage + 1); // Tăng số trang để tải bài tiếp theo
        }
      } else {
        console.warn('API không trả về danh sách bài viết hợp lệ');
        setHasMorePosts(false); // Ngừng tải thêm nếu dữ liệu không hợp lệ
      }
    } catch (error) {
      console.error('Lỗi khi lấy bài viết:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách bài viết.');
    } finally {
      setPostsLoading(false); // Dừng trạng thái đang tải
    }
  };
  
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
  
  // Gửi yêu cầu kết bạn
  const handleAddFriend = async () => {
    try {
      setLoadingRelationship(true);
      await sendFriendRequestApi(userId, userIdFromRoute); // API gửi yêu cầu kết bạn
      setRelationshipStatus('pending'); // Cập nhật trạng thái thành "đang chờ"
      Alert.alert('Thành công', 'Yêu cầu kết bạn đã được gửi.');
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu kết bạn:', error);
      Alert.alert('Lỗi', 'Không thể gửi yêu cầu kết bạn.');
    } finally {
      setLoadingRelationship(false);
    }
  };

  // Chấp nhận lời mời kết bạn
  const handleConfirmFriendRequest = async () => {
    try {
      await acceptFriendRequestApi(userId, userIdFromRoute); // API chấp nhận kết bạn
      setRelationshipStatus('friends'); // Cập nhật trạng thái thành bạn bè
      Alert.alert('Thành công', 'Bạn đã chấp nhận lời mời kết bạn.');
    } catch (error) {
      console.error('Lỗi khi chấp nhận kết bạn:', error);
      Alert.alert('Lỗi', 'Không thể chấp nhận lời mời kết bạn.');
    }
  };

  // Từ chối lời mời kết bạn
  const handleRejectFriendRequest = async () => {
    try {
      await rejectFriendRequestApi(userId, userIdFromRoute); // API từ chối kết bạn
      setRelationshipStatus('not_friends'); // Cập nhật trạng thái thành không bạn bè
      Alert.alert('Thành công', 'Bạn đã từ chối lời mời kết bạn.');
    } catch (error) {
      console.error('Lỗi khi từ chối kết bạn:', error);
      Alert.alert('Lỗi', 'Không thể từ chối lời mời kết bạn.');
    }
  };

  // Hủy kết bạn
  const handleUnfriend = async () => {
    try {
      await unfriendUserApi(userId, userIdFromRoute); // API hủy kết bạn
      setRelationshipStatus('not_friends'); // Cập nhật trạng thái thành không bạn bè
      Alert.alert('Thành công', 'Bạn đã hủy kết bạn.');
    } catch (error) {
      console.error('Lỗi khi hủy kết bạn:', error);
      Alert.alert('Lỗi', 'Không thể hủy kết bạn.');
    }
  };

  // Block tài khoản
  const handleBlockUser = async () => {
    try {
      await blockUserApi(userId, userIdFromRoute); // API block tài khoản
      setRelationshipStatus('blocked_by_sender'); // Cập nhật trạng thái thành "đã block"
      Alert.alert('Thành công', 'Tài khoản đã bị chặn.');
    } catch (error) {
      console.error('Lỗi khi chặn tài khoản:', error);
      Alert.alert('Lỗi', 'Không thể chặn tài khoản.');
    }
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
  
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
  
      const fetchData = async () => {
        try {
          // Đặt lại trạng thái khi chuyển người dùng
          setProfile(null);
          setPosts([]);
          setLoading(true);
          setPostsLoading(true);
  
          // Luôn lấy thông tin hồ sơ
          const profilePromise = fetchProfile();
          // Lấy bài viết
          const postsPromise = fetchUserPosts();
  
          // Nếu không phải tài khoản đang đăng nhập, kiểm tra trạng thái quan hệ
          if (!isCurrentUser) {
            await fetchRelationshipStatus();
          } else {
            setRelationshipStatus(null); // Xóa trạng thái quan hệ nếu là chính mình
          }
  
          // Chờ dữ liệu hoàn thành và kiểm tra trạng thái isActive
          if (isActive) {
            await Promise.all([profilePromise, postsPromise]);
          }
        } catch (error) {
          console.error('Lỗi khi tải dữ liệu:', error);
        } finally {
          if (isActive) {
            setLoading(false);
            setPostsLoading(false);
          }
        }
      };
  
      fetchData();
  
      return () => {
        isActive = false; // Hủy tác vụ nếu không còn focus
      };
    }, [userIdFromRoute, page]) // Chỉ gọi lại khi userIdFromRoute thay đổi
  );  

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
            <Image source={item.user_avatar ? { uri: item.user_avatar } : require('../../../assets/image/avatar_icon.png')} style={styles.avatarSmall} />
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

  // Hàm render phần profile cá nhân
  const renderProfileActions = () => {
    if (userId === userIdFromRoute) {
      // Trang cá nhân của tài khoản đăng nhập
      return (
        <>
          <TouchableOpacity style={styles.updateProfileButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.updateProfileButtonText}>Cập nhật thông tin</Text>
          </TouchableOpacity>
          <FlatList
            data={posts}
            renderItem={renderPostItem}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={() => fetchUserPosts()}
            onEndReachedThreshold={0.5}
          />
        </>
      );
    }
  
    if (loadingRelationship) {
      // Đang tải trạng thái quan hệ
      return <ActivityIndicator size="small" color="#000" />;
    }
  
    switch (relationshipStatus) {
      case 'friends': // Đã là bạn bè
        return (
          <>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.friendIcon}
                onLongPress={() => setMenuFriendVisible(true)} // Hiển thị menu "Hủy kết bạn" khi bấm giữ
              >
                <Icon name="check-circle" size={24} color="#00A2FF" />
                <Text style={styles.friendText}>Bạn bè</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageButton} onPress={() => navigation.navigate('Chat', { userId: userIdFromRoute })}>
                <Text style={styles.messageButtonText}>Nhắn tin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.moreOptionsButton}
                onPress={() => setMenuBlockVisible(true)} // Hiển thị menu "Block"
              >
                <Icon name="more-vert" size={24} color="#000" />
              </TouchableOpacity>
            </View>
  
            {/* Menu Hủy kết bạn */}
            {menuFriendVisible && (
              <View style={styles.menu}>
                <TouchableOpacity
                  style={styles.menuOption}
                  onPress={() => {
                    setMenuFriendVisible(false);
                    handleUnfriend(); // Gọi API hủy kết bạn
                  }}
                >
                  <Icon name="person-remove" size={24} color="#e74c3c" />
                  <Text style={styles.menuOptionText}>Hủy kết bạn</Text>
                </TouchableOpacity>
              </View>
            )}
  
            {/* Menu Block */}
            {menuBlockVisible && (
              <View style={styles.menu}>
                <TouchableOpacity
                  style={styles.menuOption}
                  onPress={() => {
                    setMenuBlockVisible(false);
                    handleBlockUser(); // Gọi API block tài khoản
                  }}
                >
                  <Icon name="block" size={24} color="#e74c3c" />
                  <Text style={styles.menuOptionText}>Block tài khoản</Text>
                </TouchableOpacity>
              </View>
            )}
  
            {/* Danh sách bài viết */}
            <FlatList
              data={posts.filter(post => post.access_status === 'FRIENDS')}
              renderItem={renderPostItem}
              keyExtractor={(item) => item.id.toString()}
              onEndReached={() => fetchUserPosts()}
              onEndReachedThreshold={0.5}
            />
          </>
        );
  
      case 'not_friends': // Không phải bạn bè
        return (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.addFriendButton} onPress={handleAddFriend}>
              <Text style={styles.addFriendButtonText}>Thêm bạn bè</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.moreOptionsButton}
              onPress={() => setMenuBlockVisible(true)} // Hiển thị menu "Block"
            >
              <Icon name="more-vert" size={24} color="#000" />
            </TouchableOpacity>
  
            {/* Menu Block */}
            {menuBlockVisible && (
              <View style={styles.menu}>
                <TouchableOpacity
                  style={styles.menuOption}
                  onPress={() => {
                    setMenuBlockVisible(false);
                    handleBlockUser(); // Gọi API block tài khoản
                  }}
                >
                  <Icon name="block" size={24} color="#e74c3c" />
                  <Text style={styles.menuOptionText}>Block tài khoản</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
  
      case 'requested': // Đã nhận được lời mời kết bạn
        return (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.confirmFriendButton} onPress={() => handleConfirmFriendRequest()}>
              <Text style={styles.confirmFriendButtonText}>Chấp nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectFriendButton}
              onLongPress={() => setMenuFriendVisible(true)} // Hiển thị menu "Từ chối" khi bấm giữ
            >
              <Text style={styles.rejectFriendButtonText}>Giữ để từ chối</Text>
            </TouchableOpacity>
  
            {/* Menu Từ chối */}
            {menuFriendVisible && (
              <View style={styles.menu}>
                <TouchableOpacity
                  style={styles.menuOption}
                  onPress={() => {
                    setMenuFriendVisible(false);
                    handleRejectFriendRequest(); // Gọi API từ chối kết bạn
                  }}
                >
                  <Icon name="close" size={24} color="#e74c3c" />
                  <Text style={styles.menuOptionText}>Từ chối</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
  
      case 'pending': // Đang chờ lời mời kết bạn
        return (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={[styles.addFriendButton, styles.pendingButton]} disabled>
              <Text style={styles.addFriendButtonText}>Yêu cầu đang chờ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.moreOptionsButton}
              onPress={() => setMenuBlockVisible(true)} // Hiển thị menu "Block"
            >
              <Icon name="more-vert" size={24} color="#000" />
            </TouchableOpacity>
  
            {/* Menu Block */}
            {menuBlockVisible && (
              <View style={styles.menu}>
                <TouchableOpacity
                  style={styles.menuOption}
                  onPress={() => {
                    setMenuBlockVisible(false);
                    handleBlockUser(); // Gọi API block tài khoản
                  }}
                >
                  <Icon name="block" size={24} color="#e74c3c" />
                  <Text style={styles.menuOptionText}>Block tài khoản</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
  
      case 'blocked_by_sender': // Tài khoản đã bị block
        return (
          <View style={styles.blockedContainer}>
            <Text style={styles.blockedMessage}>Bạn đã chặn tài khoản này.</Text>
          </View>
        );
  
      default:
        return null;
    }
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
        onEndReached={() => fetchUserPosts()}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            {/* Phần ảnh bìa và avatar */}
            <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.wallpaperContainer}>
              {/* Ảnh bìa */}
              <TouchableOpacity 
                onPress={() => isCurrentUser && handleUploadImage('wallpaper')} // Chỉ cho phép upload nếu là chính mình
                style={styles.wallpaperOverlay}
              >
                <Image
                  source={profile.wallpaper_path ? { uri: profile.wallpaper_path } : require('../../../assets/image/wallpaper.png')}
                  style={styles.wallpaper}
                />
                {isCurrentUser && (
                  <Icon name="camera-alt" size={30} color="#fff" style={styles.wallpaperIcon} />
                )}
              </TouchableOpacity>
              
              {/* Thanh điều hướng */}
              <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Icon name="arrow-back" size={28} color="#fff" style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Profile</Text>
  
                {/* Menu icon */}
                <TouchableOpacity
                  onPress={() => setMenuProfileVisible(!menuProfileVisible)}
                  style={styles.menuIconContainer}
                >
                  <Icon name="more-vert" size={28} color="#fff" style={styles.menuIcon} />
                </TouchableOpacity>
  
                {/* Menu Dropdown */}
                {menuProfileVisible && (
                  <View style={styles.menu}>
                    {isCurrentUser && (
                      <TouchableOpacity
                        style={styles.menuOption}
                        onPress={() => {
                          setMenuProfileVisible(false);
                          setLogoutModalVisible(true); // Chỉ hiển thị tùy chọn đăng xuất nếu là chính mình
                        }}
                      >
                        <Icon name="logout" size={24} color="#e74c3c" />
                        <Text style={styles.menuOptionText}>Đăng xuất</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
  
              {/* Avatar */}
              <View style={styles.avatarWrapper}>
                <TouchableOpacity 
                  onPress={() => isCurrentUser && handleUploadImage('avatar')} // Chỉ cho phép thay đổi avatar nếu là chính mình
                  style={styles.avatarContainer}
                >
                  <Image
                    source={profile.avatar_path ? { uri: profile.avatar_path } : require('../../../assets/image/avatar_icon.png')}
                    style={styles.avatar}
                  />
                  {isCurrentUser && (
                    <Icon name="camera-alt" size={25} color="#fff" style={styles.avatarIcon} />
                  )}
                </TouchableOpacity>
              </View>
            </LinearGradient>
  
            {/* Phần thông tin và các nút */}
            <View style={styles.profileContainer}>
              <Text style={styles.username}>{profile.username}</Text>
              <Text style={styles.bio}>{profile.bios}</Text>
              {isCurrentUser ? (
                // Nút cập nhật thông tin nếu là chính mình
                <TouchableOpacity style={styles.updateProfileButton} onPress={() => setModalVisible(true)}>
                  <Text style={styles.updateProfileButtonText}>Cập nhật thông tin</Text>
                </TouchableOpacity>
              ) : (
                // Hiển thị các nút hành động nếu là trang người khác
                loadingRelationship ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  renderProfileActions()
                )
              )}
            </View>
          </>
        }
        ListFooterComponent={
          postsLoading ? <ActivityIndicator size="large" color="#000" /> : null
        }
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