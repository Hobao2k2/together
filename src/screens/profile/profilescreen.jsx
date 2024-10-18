import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { getUserInfoApi, updateProfileApi, uploadImageApi } from '../../api/profileapi';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './profilestyle';

const ProfileScreen = ({ route, userId, navigation }) => {
  const userIdFromRoute = route?.params?.userId || userId;

  const [profile, setProfile] = useState({
    username: '',
    bios: '',
    avatar_path: '',
    wallpaper_path: '',
  });

  const [editableProfile, setEditableProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

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

  useEffect(() => {
    fetchProfile();  // Gọi hàm fetchProfile khi component mount
  }, [userIdFromRoute]);

  const [photo, setPhoto] = useState(null);
  const [type, setType] = useState('avatar');

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        <TouchableOpacity
          style={styles.updateProfileButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.updateProfileButtonText}>Cập nhật thông tin</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
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
    </ScrollView>
  );
};

export default ProfileScreen;
