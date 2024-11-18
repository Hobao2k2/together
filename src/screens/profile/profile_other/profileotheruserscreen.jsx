import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList, Alert, RefreshControl } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getOtherUserInfoApi } from '../../../api/profileapi';
import { fetchPostDetail, getOtherUserPostsApi } from '../../../api/postapi';
import { getUserCredentials } from '../../../api/profileapi';
import { checkRelationshipApi, sendFriendRequestApi, acceptFriendRequestApi, rejectFriendRequestApi, blockUserApi, unfriendUserApi } from '../../../api/friendapi'; 
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';
import styles from './profileotheruserstyle';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ProfileOtherUserScreen = ({ route, navigation }) => {
  const userIdFromRoute = route?.params?.userId;

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [page, setPage] = useState(0);  
  const [pageSize] = useState(10);  
  const [loading, setLoading] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [relationshipStatus, setRelationshipStatus] = useState(null); 
  const [loadingRelationship, setLoadingRelationship] = useState(false);
  const [menuFriendVisible, setMenuFriendVisible] = useState(false); 
  const [menuBlockVisible, setMenuBlockVisible] = useState(false); 
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [profile, setProfile] = useState({
    username: '',
    bios: '',
    avatar_path: '',
    wallpaper_path: '',
  });

  // Fetch thông tin người dùng
  const fetchProfile = async () => {
    try {
      const response = await getOtherUserInfoApi(userIdFromRoute);
      const userInfo = response.result;
      console.log(userInfo);
      setProfile({
        username: userInfo.username,
        bios: userInfo.bios || '',
        avatar_path: userInfo.avatar_path || '',
        wallpaper_path: userInfo.wallpaper_path || '',
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

  // Fetch bài viết của người dùng
  const fetchUserPosts = async () => {
    try {
      const response = await getOtherUserPostsApi(userIdFromRoute, page, pageSize);
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

  // Kiểm tra quan hệ giữa 2 tài khoản
  const fetchRelationshipStatus = async () => {

    if (!currentUserId) return;

    try {
      setLoadingRelationship(true);
      const response = await checkRelationshipApi(currentUserId, userIdFromRoute);
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

  // Gửi yêu cầu kết bạn
  const handleAddFriend = async () => {
    if (!currentUserId) return;
    try {
      setLoadingRelationship(true);
      await sendFriendRequestApi(currentUserId, userIdFromRoute); // API gửi yêu cầu kết bạn
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
    if (!currentUserId) return;
    try {
      await acceptFriendRequestApi(currentUserId, userIdFromRoute); // API chấp nhận kết bạn
      setRelationshipStatus('friends'); // Cập nhật trạng thái thành bạn bè
      Alert.alert('Thành công', 'Bạn đã chấp nhận lời mời kết bạn.');
    } catch (error) {
      console.error('Lỗi khi chấp nhận kết bạn:', error);
      Alert.alert('Lỗi', 'Không thể chấp nhận lời mời kết bạn.');
    }
  };

  // Từ chối lời mời kết bạn
  const handleRejectFriendRequest = async () => {
    if (!currentUserId) return;
    try {
      await rejectFriendRequestApi(currentUserId, userIdFromRoute); // API từ chối kết bạn
      setRelationshipStatus('not_friends'); // Cập nhật trạng thái thành không bạn bè
      Alert.alert('Thành công', 'Bạn đã từ chối lời mời kết bạn.');
    } catch (error) {
      console.error('Lỗi khi từ chối kết bạn:', error);
      Alert.alert('Lỗi', 'Không thể từ chối lời mời kết bạn.');
    }
  };

  // Hủy kết bạn
  const handleUnfriend = async () => {
    if (!currentUserId) return;
    try {
      await unfriendUserApi(currentUserId, userIdFromRoute); // API hủy kết bạn
      setRelationshipStatus('not_friends'); // Cập nhật trạng thái thành không bạn bè
      Alert.alert('Thành công', 'Bạn đã hủy kết bạn.');
    } catch (error) {
      console.error('Lỗi khi hủy kết bạn:', error);
      Alert.alert('Lỗi', 'Không thể hủy kết bạn.');
    }
  };

  // Block tài khoản
  const handleBlockUser = async () => {
    if (!currentUserId) return;
    try {
      await blockUserApi(currentUserId, userIdFromRoute); // API block tài khoản
      setRelationshipStatus('blocked_by_sender'); // Cập nhật trạng thái thành "đã block"
      Alert.alert('Thành công', 'Tài khoản đã bị chặn.');
    } catch (error) {
      console.error('Lỗi khi chặn tài khoản:', error);
      Alert.alert('Lỗi', 'Không thể chặn tài khoản.');
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
      setLoading(true);
      fetchProfile();
      fetchUserPosts();
      fetchRelationshipStatus();
      setLoading(false);
    }, [userIdFromRoute, page])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchCurrentUserId = async () => {
        try {
          const { userId } = await getUserCredentials();
          setCurrentUserId(userId);
        } catch (error) {
          console.error('Lỗi khi lấy userId:', error);
        }
      };
      fetchCurrentUserId();
    }, [])
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
            <Image source={item.user_avatar ? { uri: item.user_avatar } : require('../../../../assets/image/avatar_icon.png')} style={styles.avatarSmall} />
            <Text style={styles.usernamePost}>{item.username}</Text>
          </View>

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
        <Text>Đang tải dữ liệu...</Text>
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchUserPosts(true)} />
        }
        ListHeaderComponent={
          <>
            {/* Phần ảnh bìa và avatar */}
            <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.wallpaperContainer}>
                <Image
                  source={profile.wallpaper_path ? { uri: profile.wallpaper_path } : require('../../../../assets/image/wallpaper.png')}
                  style={styles.wallpaper}
                />
              {/* Thanh điều hướng */}
              <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Icon name="arrow-back" size={28} color="#fff" style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Profile</Text>
              </View>
  
              {/* Avatar */}
              <View style={styles.avatarWrapper}>
                  <Image
                    source={profile.avatar_path ? { uri: profile.avatar_path } : require('../../../../assets/image/avatar_icon.png')}
                    style={styles.avatar}
                  />
              </View>
            </LinearGradient>
  
            {/* Phần thông tin và các nút */}
            <View style={styles.profileContainer}>
              <Text style={styles.username}>{profile.username}</Text>
              <Text style={styles.bio}>{profile.bios}</Text>
              {/* Hiển thị các nút hành động nếu là trang người khác */}
              {loadingRelationship ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                renderProfileActions()
              )}
            </View>
          </>
        }
        ListFooterComponent={
          postsLoading ? <ActivityIndicator size="large" color="#000" /> : null
        }
      />
    </>
  );
};

export default ProfileOtherUserScreen;
