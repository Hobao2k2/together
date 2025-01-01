import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.88.20:8080/api';

// Hàm lấy userId và token từ AsyncStorage
export const getUserCredentials = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('userToken');

    if (!userId || !token) {
      throw new Error('Không tìm thấy thông tin người dùng trong bộ nhớ');
    }

    return { userId, token };
  } catch (error) {
    throw new Error('Lỗi khi lấy thông tin người dùng từ bộ nhớ');
  }
};

// 8. API lấy thông tin người dùng
export const getUserInfoApi = async () => {
  try {
    const { userId,token } = await getUserCredentials();  // Lấy thông tin người dùng

    const response = await axios.get(`${BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error(
      'Lỗi khi lấy thông tin người dùng:',
      error.response ? error.response.data : error.message
    );
    throw new Error('Không thể lấy thông tin người dùng');
  }
};

// 8. API lấy thông tin người dùng khác
export const getOtherUserInfoApi = async (userId) => {
  try {
    const { token } = await getUserCredentials(); // Chỉ lấy token, không lấy userId
  
    const response = await axios.get(`${BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
  
    return response.data;
    } catch (error) {
    console.error(
        'Lỗi khi lấy thông tin người dùng:',
        error.response ? error.response.data : error.message
    );
    throw new Error('Không thể lấy thông tin người dùng');
    }
};

// API cập nhật thông tin người dùng
export const updateProfileApi = async (profileData) => {
  try {
    const { userId, token } = await getUserCredentials();  // Lấy thông tin người dùng

    // Dữ liệu cập nhật thông tin người dùng đầy đủ
    const updatedProfileData = {
      username: profileData.username || '',   // Tên người dùng
      phone: profileData.phone || '',         // Số điện thoại
      gender: profileData.gender || 'Nam',    // Giới tính
      bios: profileData.bios || '',           // Thông tin cá nhân
      dob: profileData.dob || '',             // Ngày sinh
    };

    const response = await axios.put(`${BASE_URL}/users/${userId}/update-personal`, updatedProfileData, {
      headers: { Authorization: `Bearer ${token}` },  // Gửi token trong header
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin người dùng:', error.response ? error.response.data : error.message);
    throw new Error('Không thể cập nhật thông tin người dùng');
  }
};

//9. cập nhật ảnh đại diện và ảnh nền
export const uploadImageApi = async (photo, type) => {

  const { userId, token } = await getUserCredentials(); // Lấy thông tin người dùng

  const formData = new FormData();

  formData.append('image', {
    uri: photo.uri,
    name: photo.fileName || `photo_${Date.now()}.jpg`,  // Đảm bảo tên file không rỗng
    type: photo.type || 'image/jpeg',  // Đảm bảo định dạng MIME
  });

  formData.append('type', type);

  try {
    const response = await axios.post(`${BASE_URL}/users/${userId}/upload-image`, formData, {
      headers: {
        Authorization: `Bearer ${token}` ,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

