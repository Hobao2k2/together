import axios from 'axios';
import { getUserCredentials } from './profileapi'; 

const BASE_URL = 'http://14.225.254.35:8080/api';

// Hàm tiện ích để tạo header với token
const createHeadersWithToken = async () => {
  const { token } = await getUserCredentials(); 
  return {
    Authorization: `Bearer ${token}`,
  };
};

// 1. API gửi yêu cầu kết bạn
export const sendFriendRequestApi = async (senderId, receiverId) => {
  try {
    const headers = await createHeadersWithToken();
    const response = await axios.post(
      `${BASE_URL}/friends/send-request`,
      { senderId, receiverId }, // Dữ liệu body
      { headers } // Gửi headers
    );
    return response.data; // Trả về dữ liệu API
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error.response?.data || error.message || 'Lỗi không xác định';
  }
};

// 2. API chấp nhận lời mời kết bạn
export const acceptFriendRequestApi = async (senderId, receiverId) => {
  try {
    const headers = await createHeadersWithToken();
    const response = await axios.post(
      `${BASE_URL}/friends/accept-request`,
      { senderId, receiverId }, // Dữ liệu body
      { headers } // Gửi headers
    );
    return response.data; // Trả về dữ liệu API
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error.response?.data || error.message || 'Lỗi không xác định';
  }
};

// 3. API từ chối lời mời kết bạn
export const rejectFriendRequestApi = async (senderId, receiverId) => {
  try {
    const headers = await createHeadersWithToken();
    const response = await axios.post(
      `${BASE_URL}/friends/reject-request`,
      { senderId, receiverId }, // Dữ liệu body
      { headers } // Gửi headers
    );
    return response.data; // Trả về dữ liệu API
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    throw error.response?.data || error.message || 'Lỗi không xác định';
  }
};

// 4. API block 1 user khác
export const blockUserApi = async (senderId, receiverId) => {
  try {
    const headers = await createHeadersWithToken();
    const response = await axios.post(
      `${BASE_URL}/friends/block`,
      { senderId, receiverId }, // Dữ liệu body
      { headers } // Gửi headers
    );
    return response.data; // Trả về dữ liệu API
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error.response?.data || error.message || 'Lỗi không xác định';
  }
};

// 5. API hủy kết bạn
export const unfriendUserApi = async (senderId, receiverId) => {
  try {
    const headers = await createHeadersWithToken();
    const response = await axios.post(
      `${BASE_URL}/friends/unfriend`,
      { senderId, receiverId }, // Dữ liệu body
      { headers } // Gửi headers
    );
    return response.data; // Trả về dữ liệu API
  } catch (error) {
    console.error('Error unfriending user:', error);
    throw error.response?.data || error.message || 'Lỗi không xác định';
  }
};

// Hàm kiểm tra quan hệ giữa hai tài khoản
export const checkRelationshipApi = async (senderId, receiverId) => {
  try {
    const headers = await createHeadersWithToken(); // Tạo header với token nếu cần
    const response = await axios.post(
      `${BASE_URL}/friends/check-relationship`,
      {
        senderId,
        receiverId,
      },
      { headers }
    );
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error('Lỗi khi kiểm tra quan hệ:', error);
    throw error.response?.data || error.message || 'Lỗi không xác định';
  }
};
