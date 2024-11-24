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

// Hàm gọi API tin nhắn
export const fetchMessages = async (senderId, receiverId, page, size) => {
  const url = `${BASE_URL}/message/sender/id/${page}/${size}`;
  const body = {
    userReceiverId: receiverId,
    userSenderId: senderId,
  };

  try {
    const headers = await createHeadersWithToken(); // Lấy headers có token
    const response = await axios.post(url, body, { headers }); // Gửi request với headers
    return response.data; // Trả về danh sách tin nhắn
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error; // Ném lỗi để xử lý bên ngoài
  }
};

// Hàm gửi tin nhắn
export const sendMessage = async (senderId, receiverId, content) => {
  const url = `${BASE_URL}/message/send`;
  const body = {
    senderId,
    receiverId,
    content,
  };

  try {
    const headers = await createHeadersWithToken(); // Lấy headers có token
    const response = await axios.post(url, body, { headers }); // Gửi request với headers
    return response.data; // Trả về phản hồi của API
  } catch (error) {
    console.error('Error sending message:', error);
    throw error; // Ném lỗi để xử lý bên ngoài
  }
};
