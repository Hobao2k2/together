import axios from 'axios';
import { getUserCredentials } from './profileapi'; // Import hàm lấy token

const BASE_URL = 'http://14.225.254.35:8080/api';

// Hàm tiện ích để tạo header với token
const createHeadersWithToken = async () => {
  const { token } = await getUserCredentials(); // Lấy token từ profileapi
  return {
    Authorization: `Bearer ${token}`,
  };
};

// API: Lấy danh sách yêu cầu kết bạn nhận được
export const getFriendRequestsReceived = async () => {
  try {
    const { userId } = await getUserCredentials();
    const headers = await createHeadersWithToken();
    const response = await axios.get(`${BASE_URL}/users/${userId}/send-friend`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching friend requests received:', error);
    throw error;
  }
};

// API: Lấy danh sách yêu cầu kết bạn đã gửi
export const getFriendRequestsSent = async () => {
  try {
    const { userId } = await getUserCredentials();
    const headers = await createHeadersWithToken();
    const response = await axios.get(`${BASE_URL}/users/${userId}/sended-friend`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching friend requests sent:', error);
    throw error;
  }
};
