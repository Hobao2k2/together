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

// export const uploadImageApi = async () => {
//   try {
//     const { userId, token } = await getUserCredentials(); // Lấy thông tin người dùng

//     // Đọc dữ liệu từ tệp tin và chuyển đổi thành nhị phân
//     // const imageData = await RNFS.readFile(imageUri, 'base64'); // Đọc file dưới dạng base64
//     // Chuẩn bị FormData để upload
//     const formData = new FormData();
    
//     formData.append('image', {
//       uri: imageUri,  // Đường dẫn tới tệp trên thiết bị
//       name: 'photo.jpg',  // Tên tệp
//       type: 'image/jpeg'  // Loại file, có thể thay đổi nếu không phải là JPEG
//     });

//     const response = await axios.post(`${BASE_URL}/users/${userId}/upload-image`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     return response.data; 
//   } catch (error) {
//     const errorMessage = handleError(error); 
//     throw new Error(errorMessage);
//   }
// };

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
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

