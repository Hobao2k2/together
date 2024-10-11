import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://172.17.208.1:8080/api';

export const loginApi = async (email, password) => {
  try {
    // Gửi yêu cầu đăng nhập với tiêu đề Content-Type là application/json
    const response = await axios.post(
      `${BASE_URL}/auth/token`,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',  
        },
      }
    );

    // Kiểm tra phản hồi từ server
    if (response.data.code === 1000 && response.data.result.authenticated) {
      const { token } = response.data.result;

      // Lưu token vào AsyncStorage để sử dụng cho các yêu cầu tiếp theo
      await AsyncStorage.setItem('userToken', token);

      return { success: true, token };  // Trả về thông tin thành công và token
    } else {
      throw new Error('Xác thực thất bại');
    }
  } catch (error) {
    // Xử lý lỗi, hiển thị thông báo cụ thể từ server nếu có
    if (error.response && error.response.data.message) {
      throw new Error(`Lỗi từ server: ${error.response.data.message}`);
    } else {
      throw new Error('Không thể kết nối đến máy chủ');
    }
  }
};

export const registerApi = async (username, email, password, dob) => {
  try {
    console.log('Dữ liệu gửi đi:', { username, email, password, dob });  // Log dữ liệu được gửi đi

    const response = await axios.post(
      `${BASE_URL}/users`,
      {
        username: username,
        email: email,
        password: password,
        dob: dob,  // Trường ngày sinh (dob)
      },
      {
        headers: {
          'Content-Type': 'application/json',  // Xác định kiểu dữ liệu gửi là JSON
        },
      }
    );

    console.log('Phản hồi từ server:', response.data);  // Log phản hồi từ server
    return response.data;  // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    // Log chi tiết lỗi
    console.log('Lỗi xảy ra:', error);

    if (error.response) {
      console.log('Chi tiết lỗi từ server:', error.response.data);  // Log chi tiết lỗi từ phản hồi server
      throw new Error(`Lỗi từ server: ${error.response.data.message}`);
    } else {
      console.log('Không thể kết nối đến máy chủ');  // Log lỗi kết nối
      throw new Error('Không thể kết nối đến máy chủ');
    }
  }
};

// API gửi OTP tới email
export const sendOtpApi = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/otp/send`, { email });

    // Log toàn bộ thông tin phản hồi từ API
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response data:', response.data);

    return response.data;  // Trả về kết quả của API
  } catch (error) {
    // Log thông tin lỗi
    console.log('Lỗi khi gửi OTP:', error.response ? error.response.data : error.message);

    // Ném lỗi tùy chỉnh để xử lý bên ngoài
    throw new Error(error.response ? error.response.data.message : 'Không thể kết nối đến máy chủ');
  }
};

// API xác thực OTP
export const verifyOtpApi = async (email, otp) => {
  try {
    const response = await axios.post(`${BASE_URL}/otp/verify`, { email, otp });
    
    // Log toàn bộ phản hồi
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response data:', response.data);

    return response.data;  // Trả về kết quả của API
  } catch (error) {
    console.log('Lỗi khi xác thực OTP:', error.response ? error.response.data : error.message);
    throw new Error(error.response ? error.response.data.message : 'Không thể kết nối đến máy chủ');
  }
};

// API đặt lại mật khẩu mới qua id người dùng
export const resetPasswordApi = async (id, password, confirmPassword) => {
  try {
    const response = await axios.put(`${BASE_URL}/users/password/${id}`, {
      password,
      confirmPassword
    });

    // Log toàn bộ phản hồi từ API
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response data:', response.data);

    return response.data;  // Trả về kết quả của API
  } catch (error) {
    console.log('Lỗi khi đặt lại mật khẩu:', error.response ? error.response.data : error.message);
    throw new Error(error.response ? error.response.data.message : 'Không thể kết nối đến máy chủ');
  }
};




