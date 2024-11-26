import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { getFriendRequestsReceived } from '../../../api/notifications';
import { acceptFriendRequestApi, rejectFriendRequestApi } from '../../../api/friendapi';
import Toast from 'react-native-toast-message';
import styles from './requestsreceivednotificationsstyle';

const RequestsReceivedNotifications = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getFriendRequestsReceived();
      if (response?.result) {
        setData(response.result);
      } else {
        throw new Error('Không có dữ liệu kết bạn.');
      }
    } catch (err) {
      console.error('Error fetching received requests:', err);
      setError('Không thể tải danh sách lời mời kết bạn.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (senderId) => {
    try {
      const receiverId = await getUserId(); // Lấy userId của người dùng hiện tại
      await acceptFriendRequestApi(senderId, receiverId);
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
      const receiverId = await getUserId(); // Lấy userId của người dùng hiện tại
      await rejectFriendRequestApi(senderId, receiverId);
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
  );
};

export default RequestsReceivedNotifications;
