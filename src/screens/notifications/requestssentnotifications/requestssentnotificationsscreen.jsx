import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { getFriendRequestsSent } from '../../../api/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import styles from './requestssentnotificationsstyle';

const RequestsSentNotifications = () => {
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy userId từ AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          throw new Error('Không thể lấy thông tin người dùng.');
        }
      } catch (err) {
        console.error('Error fetching userId:', err);
        setError('Lỗi khi lấy thông tin người dùng.');
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  // Gọi API để lấy danh sách lời mời kết bạn đã gửi
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getFriendRequestsSent(userId);
        if (response?.result) {
          setData(response.result);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error('Error fetching sent requests:', err);
        setError('Không thể tải danh sách lời mời đã gửi.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Làm mới danh sách mỗi 10 giây
    const intervalId = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(intervalId); // Xóa interval khi component unmount
  }, [userId]);

  // Hiển thị trạng thái khi đang tải
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Hiển thị khi danh sách trống
  if (data.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Bạn không có lời mời kết bạn đã gửi.</Text>
      </View>
    );
  }

  // Hiển thị danh sách username người gửi và người nhận
  return (
    <LinearGradient colors={['#6fa3fe', '#d4f6ff', '#ffe3e3']} style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Người gửi: </Text>
              {item.username || 'Ẩn danh'}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Người nhận: </Text>
              {item.email || 'Ẩn danh'}
            </Text>
          </View>
        )}
      />
    </LinearGradient>
  );
};

export default RequestsSentNotifications;
