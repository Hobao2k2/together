import axios from 'axios';
import { getUserCredentials } from './profileapi'; // Import hàm lấy token
import io from 'socket.io-client';

const SOCKET_URL = 'http://14.225.254.35:8080';  // WebSocket Server URL
const BASE_URL = 'http://14.225.254.35:8080/api';  // REST API URL

// Tạo header với token
const createHeadersWithToken = async () => {
  const { token } = await getUserCredentials();
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Khởi tạo WebSocket
let socket = null;

// Hàm khởi tạo WebSocket (nếu chưa kết nối)
const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('receive_message', (message) => {
      console.log('Received message:', message);
      // Call the provided callback with the received message
    });
  }
};

// Hàm gửi tin nhắn qua WebSocket
export const sendMessage = (senderId, receiverId, content) => {
  return new Promise((resolve, reject) => {
    if (!senderId || !receiverId || !content) {
      reject(new Error('Sender ID, Receiver ID, and Content are required'));
      return;
    }

    const message = {
      senderId,
      receiverId,
      content,
      createdAt: new Date().toISOString(),
    };

    // Kiểm tra WebSocket kết nối
    if (socket && socket.connected) {
      socket.emit('send_message', message, (response) => {
        if (response.status === 'success') {
          resolve(response.message);
        } else {
          reject(new Error('Failed to send message'));
        }
      });
    } else {
      reject(new Error('WebSocket not connected'));
    }
  });
};

// Hàm nhận tin nhắn qua WebSocket
export const onMessageReceived = (callback) => {
  if (socket && socket.connected) {
    socket.on('receive_message', (message) => {
      callback(message); // Gọi callback với tin nhắn nhận được
    });
  } else {
    console.log('WebSocket is not connected');
  }
};

// Kết nối lại WebSocket nếu mất kết nối
export const connectSocket = () => {
  if (!socket || !socket.connected) {
    socket.connect();
  }
};

// Đóng kết nối WebSocket khi không cần thiết
export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

// Hàm lấy danh sách tin nhắn từ API
export const fetchMessages = async (senderId, receiverId, page, size) => {
  const url = `${BASE_URL}/message/sender/id/${page}/${size}`;
  const body = {
    userReceiverId: receiverId,
    userSenderId: senderId,
  };

  try {
    const headers = await createHeadersWithToken();
    const response = await axios.post(url, body, { headers });
    return response.data.result.content;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Gọi initSocket để khởi tạo kết nối WebSocket
initSocket();
