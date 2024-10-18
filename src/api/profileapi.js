import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://14.225.254.35:8080/api';

// Hàm lấy userId và token từ AsyncStorage
const getUserCredentials = async () => {
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

// API lấy thông tin người dùng
export const getUserInfoApi = async () => {
  try {
    const { userId, token } = await getUserCredentials();  // Lấy thông tin người dùng

    const response = await axios.get(`${BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },  // Gửi token trong header
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error.response ? error.response.data : error.message);
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

export const uploadImageApi = async (imageUri, type) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg', // MIME type của ảnh
    name: `${type}.jpg`, // Đặt tên file
  });
  formData.append('type', type);  // "avatar" hoặc "wallpaper"

  try {
    const { userId, token } = await getUserCredentials();  // Lấy thông tin người dùng

    const response = await axios.post(`${BASE_URL}/users/${userId}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,  // Gửi token trong header
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server trả về lỗi
      console.error('Lỗi từ server:', error.response.data);
      throw new Error(`Không thể upload ${type}: ${error.response.data.message || 'Lỗi không xác định từ server'}`);
    } else if (error.request) {
      // Yêu cầu được gửi nhưng không nhận được phản hồi
      console.error('Không có phản hồi từ server:', error.request);
      throw new Error('Không có phản hồi từ server. Kiểm tra lại kết nối mạng.');
    } else {
      // Một lỗi xảy ra khi thiết lập yêu cầu
      console.error('Lỗi khi tạo yêu cầu:', error.message);
      throw new Error(`Lỗi khi upload ${type}: ${error.message}`);
    }
  }
};

