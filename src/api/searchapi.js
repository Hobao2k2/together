import axios from 'axios';
import { getUserCredentials } from './profileapi';

const BASE_URL = 'http://14.225.254.35:8080/api/users/search-people';

// Hàm tiện ích để tạo header với token
const createHeadersWithToken = async () => {
  try {
    const { token } = await getUserCredentials(); // Lấy token người dùng
    if (!token) {
      throw new Error('Token is missing. Please log in again.');
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  } catch (error) {
    console.error('Error creating headers with token:', error);
    throw error;
  }
};

// Function to call search API
export const fetchSearchResults = async (keyword, keyboard) => {
  try {
    const headers = await createHeadersWithToken();
    if (!headers.Authorization) {
      throw new Error('Unauthorized: Token is missing or invalid. Please check your credentials.');
    }
    const response = await axios.post(BASE_URL, { keyword, keyboard }, { headers: headers });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized request. Please check your credentials.');
      Alert.alert('Authentication Error', 'Your session has expired. Please log in again.');
    } else {
      console.error('Error fetching search results:', error);
    }
    throw error;
  }
};