import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { getFriendRequestsReceived } from '../../../api/notifications';
import { acceptFriendRequestApi, rejectFriendRequestApi } from '../../../api/friendapi';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import LinearGradient from 'react-native-linear-gradient';
import styles from './requestsreceivednotificationsstyle';

const RequestsReceivedNotifications = () => {
  const [data, setData] = useState([]); // Lưu danh sách lời mời kết bạn
  const [loading, setLoading] = useState(true); // Tình trạng loading
  const [error, setError] = useState(null); // Lỗi khi tải dữ liệu
  const [userId, setUserId] = useState(null); // Lưu userId của người nhận

  useEffect(() => {
    // Lấy userId từ AsyncStorage khi component mount
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId'); // Lấy userId từ AsyncStorage
        if (storedUserId) {
          setUserId(storedUserId); // Cập nhật userId vào state
        } else {
          setError('Không thể lấy thông tin người dùng.');
        }
      } catch (err) {
        setError('Lỗi khi lấy thông tin người dùng.');
      }
    };
    
    fetchUserId(); // Gọi hàm lấy userId khi component mount
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (userId) {
        fetchData(); // Gọi lại hàm fetchData để làm mới dữ liệu
      }
    }, 10000); 

  }, [userId]);
  
  const fetchData = async () => {
    try {
      const response = await getFriendRequestsReceived(); // Lấy danh sách lời mời kết bạn
      if (response?.result) {
        setData(response.result); // Cập nhật dữ liệu vào state
      } else {
        throw new Error('Không có dữ liệu kết bạn.');
      }
    } catch (err) {
      console.error('Error fetching received requests:', err);
      setError('Không thể tải danh sách lời mời kết bạn.');
    } finally {
      setLoading(false); // Đổi trạng thái loading khi tải xong
    }
  };

  const handleAccept = async (senderId) => {
    try {
      if (!userId) throw new Error('Không có thông tin người nhận.');
      await acceptFriendRequestApi(senderId, userId); // Gửi yêu cầu chấp nhận
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Bạn đã chấp nhận lời mời kết bạn.',
      });
      fetchData(); // Tải lại danh sách sau khi chấp nhận
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Không thể chấp nhận lời mời kết bạn.',
      });
    }
  };

  const handleReject = async (senderId) => {
    try {
      if (!userId) throw new Error('Không có thông tin người nhận.');
      await rejectFriendRequestApi(senderId, userId); // Gửi yêu cầu từ chối
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Bạn đã từ chối lời mời kết bạn.',
      });
      fetchData(); // Tải lại danh sách sau khi từ chối
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Không thể từ chối lời mời kết bạn.',
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Bạn không có lời mời kết bạn nào.</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#6fa3fe', '#d4f6ff', '#ffe3e3']} style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {/* Avatar */}
            <Image
              source={
                item.avatar_path
                  ? { uri: item.avatar_path }
                  : require('../../../../assets/image/avatar_icon.png')
              }
              style={styles.avatar}
            />
            {/* Thông tin người gửi */}
            <View style={styles.info}>
              <Text style={styles.username}>{item.username || 'Người dùng ẩn danh'}</Text>
              <Text style={styles.email}>{item.email || 'Không có email'}</Text>
            </View>
            {/* Nút Đồng ý và Từ chối */}
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAccept(item.id)}
              >
                <Text style={styles.buttonText}>Đồng ý</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleReject(item.id)}
              >
                <Text style={styles.buttonText}>Từ chối</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </LinearGradient>
  );
};

export default RequestsReceivedNotifications;
