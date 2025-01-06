import axios from 'axios';

export const getChatList = async (userId) => {
  try {
    const response = await axios.get(`http://10.0.88.20:9001/chat/${userId}`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching chat data: ", error);
    throw error;
  }
};
