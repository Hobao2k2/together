import axios from 'axios';
import { getUserCredentials } from './profileapi';

const BASE_URL = 'http://14.225.254.35:8080/api/users/search-people';

const createHeadersWithToken = async () => {
  try {
    const { token } = await getUserCredentials();
    if (!token) {
      throw new Error('Token is missing. Please log in again.');
    }
    console.log('Token retrieved successfully:', token); // Log kiểm tra token
    return {
      Authorization: `Bearer ${token}`,
    };
  } catch (error) {
    console.error('Error creating headers with token:', error);
    throw error;
  }
};

export const fetchSearchResults = async (keyword, keyboard) => {
  try {
    const headers = await createHeadersWithToken();
    if (!headers.Authorization) {
      throw new Error('Unauthorized: Token is missing or invalid. Please check your credentials.');
    }

    // Tạo URL endpoint động
    const url = `${BASE_URL}/${encodeURIComponent(keyword)}/${keyboard}`;
    console.log('Calling API URL:', url); // Log URL để kiểm tra

    // Gửi request tới API
    const response = await axios.get(url, {
      headers: headers,
    });

    console.log('API response received:', response.data); // Log phản hồi từ API
    return response.data;
  } catch (error) {
    console.error('Error fetching search results:', error); // Log lỗi khi xảy ra
    throw error;
  }
};
