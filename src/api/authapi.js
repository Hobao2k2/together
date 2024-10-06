import axios from 'axios';

const BASE_URL = '';

export const loginApi = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Đăng nhập thất bại');
  }
};

export const registerApi = async (username, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, { username, email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Đăng ký thất bại');
  }
};
