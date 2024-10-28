import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchPosts } from '../../../api/postapi';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './homestyle';

const HomeScreen = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const navigation = useNavigation();

  const loadPosts = async () => {
    setLoading(true);
    const result = await fetchPosts(userId, page, 10);
    if (result.success) {
      const { content, last } = result.data;
      setPosts((prevPosts) => [...prevPosts, ...content]);
      setIsLastPage(last);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, [page]);

  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postContainer}
      onPress={() => navigation.navigate('PostDetail', { article_id: item.id, owner_id: item.user_id })}
    >
      {/* Header: Avatar and Username */}
      <View style={styles.postHeader}>
        <Image source={{ uri: item.user_avatar }} style={styles.avatar} />
        <Text style={styles.username}>{item.username}</Text>
      </View>

      {/* Content: Text and Image */}
      <View style={styles.postContent}>
        <Text style={styles.contentText}>{item.content}</Text>
        {item.image_article.length > 0 && (
          <Image source={{ uri: item.image_article[0] }} style={styles.postImage} />
        )}
        {item.video_article && (
          <Text style={styles.videoText}>Video: {item.video_article}</Text> // Placeholder for video component
        )}
      </View>

      {/* Footer: Icons for Like, Comment, and Share */}
      <View style={styles.postFooter}>
        <View style={styles.iconContainer}>
          <Icon name="heart-outline" size={20} color="#666" />
          <Text style={styles.footerText}>{item.number_reaction}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Icon name="chatbubble-outline" size={20} color="#666" />
          <Text style={styles.footerText}>{item.number_comment}</Text>
        </View>
        <Icon name="share-outline" size={20} color="#666" />
      </View>
    </TouchableOpacity>
  );

  const loadMorePosts = () => {
    if (!loading && !isLastPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      {loading && page === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator size="small" color="#0000ff" /> : null}
        />
      )}
    </View>
  );
};

export default HomeScreen;
