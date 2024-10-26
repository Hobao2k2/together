import axios from 'axios';
import RNFS from 'react-native-fs';
import { getUserCredentials } from './profileapi'; 

// Lấy danh sách bài viết của người dùng
export const getArticles = async (page, articlesPerPage) => {
  try {
    const { userId, token } = await getUserCredentials(); 

    const response = await axios.get(
      `http://14.225.254.35:8080/api/article/${userId}/get-articles/${page}/${articlesPerPage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

// Thêm bài viết mới
export const addArticle = async (content, accessStatus, imageFiles, videoFile) => {
  const { userId, token } = await getUserCredentials();

  const formData = new FormData();
  formData.append('content', content);
  formData.append('access_status', accessStatus);

  // Thêm ảnh vào `FormData`
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file, index) => {
      formData.append('images_file', {
        uri: file.uri,
        name: file.fileName || `image_${index}.jpg`,
        type: file.type || 'image/jpeg',
      });
    });
  }

  // Thêm video vào `FormData` nếu có
  if (videoFile && videoFile.uri) {
    formData.append('video_file', {
      uri: videoFile.uri,
      type: videoFile.type || 'video/mp4',
      name: videoFile.fileName || `video_${Date.now()}.mp4`,
    });
    console.log('Added video to FormData:', videoFile);
  }

  // Log toàn bộ `FormData` trước khi gửi
  console.log("Logging all FormData parts before sending:");
  formData._parts.forEach(part => {
    console.log("Key:", part[0], "Value:", part[1]);
  });

  try {
    const response = await axios.post(
      `http://14.225.254.35:8080/api/article/${userId}/post-article`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('Server Response:', response.data);
    return response.data;

  } catch (error) {
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    alert('Failed to submit post');
    throw error;
  }
};

// Sửa bài viết
export const updateArticle = async (articleId, content, accessStatus, imageFile, videoFile) => {
  try {
    const { userId, token } = await getUserCredentials(); // Lấy userId và token

    const formData = new FormData();
    formData.append('content', content);
    formData.append('access_status', accessStatus);
    if (imageFile) {
      formData.append('images_file', {
        uri: imageFile.uri,
        type: imageFile.type,
        name: imageFile.name,
      });
    }
    if (videoFile) {
      formData.append('video_file', {
        uri: videoFile.uri,
        type: videoFile.type,
        name: videoFile.name,
      });
    }

    const response = await axios.put(
      `http://14.225.254.35:8080/api/article/${userId}/update-article/${articleId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Truyền token trong header
          'Content-Type': 'multipart/form-data', // Đảm bảo gửi đúng loại form data
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
};

// Xóa bài viết
export const deleteArticle = async (articleId) => {
  try {
    const { userId, token } = await getUserCredentials(); // Lấy userId và token

    const response = await axios.delete(
      `http://14.225.254.35:8080/api/article/${userId}/delete-article/${articleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Truyền token trong header
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};

// Hàm lấy các bài viết của người dùng 
export const getUserPostsApi = async (page = 0, pageSize = 10) => {
  try {
    const { userId } = await getUserCredentials();
    // Gọi API lấy danh sách bài viết
    const response = await axios.get(`http://14.225.254.35:8080/api/article/${userId}/get-articles/${page}/${pageSize}`);
    
    // Trả về dữ liệu từ API (giả sử response.data là mảng bài viết)
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy bài viết của người dùng:', error);
    throw error;
  }
};

// Hàm lấy chi tiết bài viết
export const getArticleDetailApi = async (articleId, ownerId) => {
  try {
    // Gọi API bằng axios với phương thức POST và dữ liệu trong body
    const response = await axios.get('http://14.225.254.35:8080/api/article/detail-article', {
      article_id: articleId,
      owner_id: ownerId,
    });

    // Kiểm tra mã phản hồi từ API
    if (response.data.code === 1000) {
      return response.data.result;  // Trả về dữ liệu bài viết chi tiết
    } else {
      throw new Error('API trả về mã lỗi không mong muốn.');
    }
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết bài viết:', error.response ? error.response.data : error.message);
    throw error;
  }
};