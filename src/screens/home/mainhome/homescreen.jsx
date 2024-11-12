import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { fetchPosts, fetchPostDetail } from '../../../api/postapi';
import { getUserInfoApi } from '../../../api/profileapi';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';
import styles from './homestyle';

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [userCache, setUserCache] = useState({}); // Bộ nhớ tạm để lưu thông tin người dùng
  const navigation = useNavigation();

  // Hàm tải bài viết
  const loadPosts = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
  
    try {
      const result = await fetchPosts(refresh ? 0 : page, 10);
      if (result.success) {
        const { content, last } = result.data;
  
        // Lấy thông tin người dùng cho mỗi bài viết
        const updatedPosts = await Promise.all(
          content.map(async (post) => {
            // Log user_id để kiểm tra
            console.log(`Processing user_id: ${post.user_id}`);
  
            // Kiểm tra cache để tránh gọi lại API không cần thiết
            if (!userCache[post.user_id]) {
              try {
                const userInfo = await getUserInfoApi(post.user_id);
                console.log(`User info for ${post.user_id}:`, userInfo);
  
                setUserCache((prevCache) => ({
                  ...prevCache,
                  [post.user_id]: userInfo, // Lưu thông tin vào cache
                }));
              } catch (error) {
                console.error(`Lỗi khi lấy thông tin user: ${post.user_id}`, error);
              }
            }
  
            // Cập nhật bài viết với thông tin người dùng
            return {
              ...post,
              username: userCache[post.user_id]?.username || post.username,
              user_avatar: userCache[post.user_id]?.avatar || post.user_avatar,
            };
          })
        );
  
        setPosts((prevPosts) =>
          refresh
            ? updatedPosts
            : [...prevPosts, ...updatedPosts.filter((post) => !prevPosts.some((p) => p.id === post.id))]
        );
        setIsLastPage(last);
        if (refresh) setPage(0);
      }
    } catch (error) {
      console.error('Lỗi khi tải bài viết:', error);
      Alert.alert('Thông báo', 'Đã xảy ra lỗi khi tải bài viết. Vui lòng thử lại.');
    } finally {
      if (refresh) setRefreshing(false);
      else setLoading(false);
    }
  };  

  useEffect(() => {
    loadPosts();
  }, [page]);

  // Hàm chuyển sang màn hình chi tiết bài viết
  const handlePostPress = async (articleId, ownerId) => {
    try {
      const articleDetail = await fetchPostDetail(articleId, ownerId);
      if (articleDetail.success) {
        navigation.navigate('PostDetail', { postDetail: articleDetail.data });
      } else {
        Alert.alert('Thông báo', 'Không thể lấy chi tiết bài viết. Vui lòng thử lại sau!');
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết bài viết:', error.message);
      Alert.alert('Thông báo', 'Đã xảy ra lỗi khi lấy chi tiết bài viết!');
    }
  };

  // Hàm render từng bài viết
  const renderPost = ({ item }) => {
    const mediaData = [
      ...Array.from(new Set(item.image_article || [])).map((image) => ({
        type: 'image',
        url: image,
      })),
      item.video_article ? { type: 'video', url: item.video_article } : null,
    ].filter(Boolean);

    return (
      <TouchableOpacity onPress={() => handlePostPress(item.id, item.user_id)}>
        <View style={styles.postItemContainer}>
          {/* Header */}
          <View style={styles.postHeader}>
            <Image
              source={item.user_avatar ? { uri: item.user_avatar } : require('../../../../assets/image/avatar_icon.png')}
              style={styles.avatarSmall}
            />
            <Text style={styles.usernamePost}>{item.username}</Text>
          </View>

          {/* Nội dung bài viết */}
          <Text style={styles.postContent}>{item.content}</Text>

          {/* Media */}
          {mediaData.length > 0 && (
            <View style={styles.mediaContainer}>
              <Swiper style={styles.swiper} showsPagination loop>
                {mediaData.map((media, index) => (
                  <View key={index} style={styles.mediaWrapper}>
                    {media.type === 'image' ? (
                      <Image source={{ uri: media.url }} style={styles.postImage} />
                    ) : (
                      <Video
                        source={{ uri: media.url }}
                        style={styles.postVideo}
                        paused
                        resizeMode="cover"
                        controls
                      />
                    )}
                  </View>
                ))}
              </Swiper>
            </View>
          )}

          {/* Footer */}
          <View style={styles.postInteractionContainer}>
            <TouchableOpacity style={styles.interactionButton}>
              <Icon name="favorite-border" size={20} color="#000" />
              <Text style={styles.interactionText}>{item.number_reaction} Likes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.interactionButton}>
              <Icon name="chat-bubble-outline" size={20} color="#000" />
              <Text style={styles.interactionText}>{item.number_comment} Comments</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const loadMorePosts = () => {
    if (!loading && !isLastPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleRefresh = () => {
    loadPosts(true);
  };

  const handleNavigateToMessages = () => {
    navigation.navigate('Messages');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleRefresh}>
          <Text style={styles.logoText}>Together</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNavigateToMessages}>
          <MaterialCommunityIcons name="facebook-messenger" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Danh sách bài viết */}
      {loading && page === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator size="small" color="#0000ff" /> : null}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        />
      )}
    </View>
  );
};

export default HomeScreen;
