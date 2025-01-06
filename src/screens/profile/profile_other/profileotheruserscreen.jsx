import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getOtherUserInfoApi } from '../../../api/profileapi';
import { fetchPostDetail, getOtherUserPostsApi } from '../../../api/postapi';
import { checkRelationshipApi, sendFriendRequestApi, acceptFriendRequestApi, rejectFriendRequestApi, blockUserApi, unfriendUserApi } from '../../../api/friendapi'; 
import { likeArticleApi } from '../../../api/comment&like';
import { getUserCredentials } from '../../../api/profileapi';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swiper from 'react-native-swiper';
import Toast from 'react-native-toast-message';
import Video from 'react-native-video';
import styles from './profileotheruserstyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ProfileOtherUserScreen = ({ route, navigation}) => {
  const userIdFromRoute = route?.params?.userId;

  const [posts, setPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true); 
  const [postsLoading, setPostsLoading] = useState(true);
  const [page, setPage] = useState(0);  
  const [pageSize] = useState(10);  
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [menuPostVisible, setMenuPostVisible] = useState(false); 
  const [activeMenuPostId, setActiveMenuPostId] = useState(null);
  const [relationshipStatus, setRelationshipStatus] = useState(null); 
  const [loadingRelationship, setLoadingRelationship] = useState(false);
  const [menuFriendVisible, setMenuFriendVisible] = useState(false); // Hiển thị menu bạn bè
  const [menuBlockVisible, setMenuBlockVisible] = useState(false); // Hiển thị menu block
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true); // Thêm cờ khởi tạo
  const [isFetched, setIsFetched] = useState(false);

  const [profile, setProfile] = useState({
    username: '',
    bios: '',
    avatar_path: '',
    wallpaper_path: '',
  });

  // Fetch thông tin người dùng
  const fetchProfile = async () => {

    if (!currentUserId || !userIdFromRoute) {
      console.warn('fetchProfile: currentUserId hoặc userIdFromRoute không hợp lệ.');
      return;
    }

    try {
      const response = await getOtherUserInfoApi(userIdFromRoute);
      const userInfo = response.result;
  
      setProfile({
        username: userInfo.username || 'Không có tên',
        bios: userInfo.bios || '',
        avatar_path: userInfo.avatar_path || '',
        wallpaper_path: userInfo.wallpaper_path || '',
        phone: userInfo.phone || '',
        gender: userInfo.gender || '',
        dob: userInfo.dob || '',
      });
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      setProfile({
        username: 'Không xác định',
        bios: '',
        avatar_path: '',
        wallpaper_path: '',
      });
    }
  };  

  // Fetch bài viết của người dùng
  const fetchUserPosts = async () => {
    if (isFetched || !currentUserId || !userIdFromRoute) {
      console.warn('Dữ liệu đã được tải hoặc thông tin không hợp lệ.');
      return;
    }
  
    try {
      setPostsLoading(true);
      const response = await getOtherUserPostsApi(userIdFromRoute, page, pageSize);
      const postsData = response.result;
  
      if (Array.isArray(postsData)) {
        setPosts((prevPosts) => {
          const uniquePosts = [...prevPosts, ...postsData].reduce((acc, current) => {
            const exists = acc.find((item) => item.id === current.id);
            if (!exists) acc.push(current);
            return acc;
          }, []);
          return uniquePosts;
        });
  
        if (postsData.length < pageSize) {
          setHasMorePosts(false); // Không còn bài viết mới
        }
  
        setIsFetched(true); // Đánh dấu đã tải dữ liệu
      }
    } catch (error) {
      console.error('Lỗi khi lấy bài viết:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchRelationshipStatus = async () => {

    if (!currentUserId || !userIdFromRoute) {
      console.warn('fetchRelationshipStatus: currentUserId hoặc userIdFromRoute không hợp lệ.');
      return;
    }
  
    try {
      const response = await checkRelationshipApi(currentUserId, userIdFromRoute);
      const result = response?.result;
      console.log('Kết quả mối quan hệ từ API:', result); // Log giá trị trả về từ API
  
      switch (result) {
        case 'FRIEND':
          setRelationshipStatus('friends');
          break;
        case 'REQUEST':
          setRelationshipStatus('pending');
          break;
        case 'REQUESTED':
          setRelationshipStatus('requested');
          break;
        case 'BLOCK':
          setRelationshipStatus('blocked_by_sender');
          break;
        case 'BLOCKED':
          setRelationshipStatus('blocked');
          break;
        case 'NONE':
          setRelationshipStatus('none');
          break;
      }
  
      console.log('Trạng thái relationshipStatus sau set:', relationshipStatus);
    } catch (error) {
      console.error('Lỗi khi kiểm tra mối quan hệ:', error);
      setRelationshipStatus(null);
    }
  };   

  // Hàm lấy currentUserId từ AsyncStorage
  const fetchCurrentUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('Không tìm thấy userId trong bộ nhớ cục bộ.');
      }
      console.log('Lấy userId từ AsyncStorage:', userId);
      setCurrentUserId(userId);
    } catch (error) {
      console.error('Lỗi khi lấy userId từ AsyncStorage:', error);
      setCurrentUserId(null);
    }
  };

  // Gửi yêu cầu kết bạn
  const handleAddFriend = async () => {
    if (!currentUserId) return;
    try {
      setLoadingRelationship(true);
      await sendFriendRequestApi(currentUserId, userIdFromRoute); // API gửi yêu cầu kết bạn
      setRelationshipStatus('pending'); // Cập nhật trạng thái thành "đang chờ"
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Yêu cầu kết bạn đã được gửi.',
      });
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu kết bạn:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể gửi yêu cầu kết bạn.',
      });
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
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Bạn đã chấp nhận lời mời kết bạn.',
      });
    } catch (error) {
      console.error('Lỗi khi chấp nhận kết bạn:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể chấp nhận lời mời kết bạn.',
      });
    }
  };

  // Từ chối lời mời kết bạn
  const handleRejectFriendRequest = async () => {
    if (!currentUserId) return;
    try {
      await rejectFriendRequestApi(currentUserId, userIdFromRoute); // API từ chối kết bạn
      setRelationshipStatus('not_friends'); // Cập nhật trạng thái thành không bạn bè
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Bạn đã từ chối lời mời kết bạn.',
      });
    } catch (error) {
      console.error('Lỗi khi từ chối kết bạn:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể từ chối lời mời kết bạn.',
      });
    }
  };

  // Hủy kết bạn
  const handleUnfriend = async () => {
    if (!currentUserId) return;
    try {
      await unfriendUserApi(currentUserId, userIdFromRoute); // API hủy kết bạn
      setRelationshipStatus('not_friends'); // Cập nhật trạng thái thành không bạn bè
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Bạn đã hủy kết bạn.',
      });
    } catch (error) {
      console.error('Lỗi khi hủy kết bạn:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể hủy kết bạn.',
      });
    }
  };

  // Block tài khoản
  const handleBlockUser = async () => {
    if (!currentUserId) return;
    try {
      await blockUserApi(currentUserId, userIdFromRoute); // API block tài khoản
      setRelationshipStatus('blocked_by_sender'); // Cập nhật trạng thái thành "đã block"
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Tài khoản đã bị chặn.',
      });
    } catch (error) {
      console.error('Lỗi khi chặn tài khoản:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể chặn tài khoản.',
      });
    }
  };

  const handlePostPress = async (articleId, ownerId) => {
    try {
      // Lấy chi tiết bài viết từ API
      const articleDetail = await fetchPostDetail(articleId, ownerId);
      
      if (articleDetail.success) {
        // Chuyển đến màn hình PostDetail và chỉ truyền articleId và ownerId
        navigation.navigate('PostDetail', { articleId, ownerId });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: articleDetail.error,
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết bài viết:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể lấy chi tiết bài viết',
      });
    }
  };

  const handleLikeArticle = async (item, index) => {
      const liked = item.reaction === 1 ? 0 : 1; // Thay đổi trạng thái like
      const originalReaction = item.reaction;
      const originalNumberReaction = item.number_reaction;
    
      try {
        // Cập nhật giao diện trước để phản hồi nhanh cho người dùng
        const updatedPosts = [...posts];
        updatedPosts[index] = {
          ...item,
          reaction: liked,
          number_reaction: item.number_reaction + (liked === 1 ? 1 : -1),
        };
        setPosts(updatedPosts);
    
        // Gửi yêu cầu lên API
        const { userId } = await getUserCredentials();
        await likeArticleApi(userId, item.id, liked);
    
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: liked ? 'Đã thích bài viết.' : 'Đã bỏ thích bài viết.',
        });
      } catch (error) {
        console.error('Lỗi khi like bài viết:', error.message);
    
        // Hoàn tác nếu có lỗi
        const revertedPosts = [...posts];
        revertedPosts[index] = {
          ...item,
          reaction: originalReaction,
          number_reaction: originalNumberReaction,
        };
        setPosts(revertedPosts);
    
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể thực hiện thao tác thích bài viết.',
        });
      }
    };  

  const initializeData = useCallback(async () => {
    console.log('Initializing...');
    setLoading(true);

    try {
      await fetchCurrentUserId(); // Lấy currentUserId

      if (!currentUserId || !userIdFromRoute) {
        console.warn('currentUserId hoặc userIdFromRoute không hợp lệ.');
        return;
      }

      await Promise.all([fetchProfile(), fetchUserPosts(), fetchRelationshipStatus()]);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      console.log('Kết thúc tải dữ liệu.');
      setLoading(false);
    }
  }, [currentUserId, userIdFromRoute]);

  // Chỉ chạy khi lần đầu load màn hình hoặc userIdFromRoute thay đổi
  useEffect(() => {
    if (userIdFromRoute) {
      initializeData();
    }
  }, [userIdFromRoute, initializeData]);

  // Làm mới khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      if (currentUserId && userIdFromRoute) {
        console.log('Refreshing data...');
        initializeData(); // Tận dụng lại logic
      } else {
        console.warn('Dữ liệu không đủ để làm mới.');
      }
    }, [currentUserId, userIdFromRoute, initializeData])
  );

  const renderPostItem = ({ item, index }) => {
    // Tạo danh sách media (hình ảnh/video)
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
  
    // Kiểm tra xem menu của bài viết có đang mở không
    const isMenuOpen = activeMenuPostId === item.id;
  
    return (
      <TouchableOpacity onPress={() => handlePostPress(item.id, item.user_id)}>
        <View style={styles.postItemContainer}>
          {/* Header bài viết */}
          <View style={styles.postHeader}>
            <Image
              source={
                item.user_avatar
                  ? { uri: item.user_avatar }
                  : require('../../../../assets/image/avatar_icon.png')
              }
              style={styles.avatarSmall}
            />
            <Text style={styles.usernamePost}>{item.username}</Text>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setActiveMenuPostId(isMenuOpen ? null : item.id)}
            >
              <Icon name="more-vert" size={24} color="#333" />
            </TouchableOpacity>
          </View>
  
          {/* Menu Popup */}
          {isMenuOpen && (
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
            <View style={styles.mediaContainer}>
              <Swiper style={styles.swiper} showsPagination loop>
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
            {/* Like Button */}
            <TouchableOpacity
              style={styles.interactionButton}
              onPress={() => handleLikeArticle(item, index)}
            >
              <Icon
                name={item.reaction === 1 ? 'favorite' : 'favorite-border'}
                size={20}
                color={item.reaction === 1 ? 'red' : '#000'}
              />
              <Text style={styles.interactionText}>{item.number_reaction} Likes</Text>
            </TouchableOpacity>
  
            {/* Comment Button */}
            <TouchableOpacity
              style={styles.interactionButton}
              onPress={() => handlePostPress(item.id, item.user_id)} // Chuyển đến chi tiết bài viết
            >
              <Icon name="chat-bubble-outline" size={20} color="#000" />
              <Text style={styles.interactionText}>{item.number_comment} Comments</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };  

  const filteredPosts = useMemo(() => {
    if (relationshipStatus === 'friends') {
      return posts.filter((post) => post.access_status === 'FRIEND');
    }
    return [];
  }, [relationshipStatus, posts]);  

  // Hàm render phần profile cá nhân
  const renderProfileActions = () => {
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
              <TouchableOpacity
                style={styles.messageButton}
                onPress={() => {
                  if (currentUserId && userIdFromRoute) {
                    navigation.navigate('Messages', {
                      screen: 'ChatUser', // Điều hướng đến ChatUser bên trong MessageStackNavigator
                      params: {
                        senderId: currentUserId,  // Gửi senderId (ID của người dùng hiện tại)
                        receiverId: userIdFromRoute // Gửi receiverId (ID của người bạn muốn nhắn tin)
                      },
                    });
                  }
                }}
              >
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
          </>
        );

      case 'none': // Không có quan hệ
        return (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.addFriendButton} onPress={handleAddFriend}>
              <Text style={styles.addFriendButtonText}>Thêm bạn bè</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.messageButton}
                onPress={() => {
                  if (currentUserId && userIdFromRoute) {
                    navigation.navigate('Messages', {
                      screen: 'ChatUser', // Điều hướng đến ChatUser bên trong MessageStackNavigator
                      params: {
                        senderId: currentUserId,  // Gửi senderId (ID của người dùng hiện tại)
                        receiverId: userIdFromRoute // Gửi receiverId (ID của người bạn muốn nhắn tin)
                      },
                    });
                  }
                }}
              >
                <Text style={styles.messageButtonText}>Nhắn tin</Text>
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
                style={styles.messageButton}
                onPress={() => {
                  if (currentUserId && userIdFromRoute) {
                    navigation.navigate('Messages', {
                      screen: 'ChatUser', // Điều hướng đến ChatUser bên trong MessageStackNavigator
                      params: {
                        senderId: currentUserId,  // Gửi senderId (ID của người dùng hiện tại)
                        receiverId: userIdFromRoute // Gửi receiverId (ID của người bạn muốn nhắn tin)
                      },
                    });
                  }
                }}
              >
                <Text style={styles.messageButtonText}>Nhắn tin</Text>
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
                <TouchableOpacity
                  style={styles.messageButton}
                  onPress={() => {
                    if (currentUserId && userIdFromRoute) {
                      navigation.navigate('Messages', {
                        screen: 'ChatUser', // Điều hướng đến ChatUser bên trong MessageStackNavigator
                        params: {
                          senderId: currentUserId,  // Gửi senderId (ID của người dùng hiện tại)
                          receiverId: userIdFromRoute // Gửi receiverId (ID của người bạn muốn nhắn tin)
                        },
                      });
                    }
                  }}
                >
                  <Text style={styles.messageButtonText}>Nhắn tin</Text>
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
                style={styles.messageButton}
                onPress={() => {
                  if (currentUserId && userIdFromRoute) {
                    navigation.navigate('Messages', {
                      screen: 'ChatUser', // Điều hướng đến ChatUser bên trong MessageStackNavigator
                      params: {
                        senderId: currentUserId,  // Gửi senderId (ID của người dùng hiện tại)
                        receiverId: userIdFromRoute // Gửi receiverId (ID của người bạn muốn nhắn tin)
                      },
                    });
                  }
                }}
              >
                <Text style={styles.messageButtonText}>Nhắn tin</Text>
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
        case 'blocked': // Tài khoản đã block bạn
        return (
          <View style={styles.blockedContainer}>
            <Text style={styles.blockedMessage}>Tài khoản này đã chặn bạn</Text>
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
        <Text>Đang tải...</Text>
      </View>
    );
  }  

  return (
    <>
      <FlatList
         data={filteredPosts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id || item.uniqueIdentifier}
        onEndReached={() => fetchUserPosts()}
        nestedScrollEnabled={true}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            {/* Phần ảnh bìa và avatar */}
            <LinearGradient colors={['#6a11cb', '#2575fc']} style={[styles.wallpaperContainer, { flex: 1 }]}>
              {/* Ảnh bìa */}
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
                <View style={styles.avatarContainer}>
                  <Image
                    source={profile.avatar_path ? { uri: profile.avatar_path } : require('../../../../assets/image/avatar_icon.png')}
                    style={styles.avatar}
                  />
                </View>
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