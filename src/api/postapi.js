import axios from 'axios';
import { getUserCredentials } from './profileapi'; 

const BASE_URL = 'http://14.225.254.35:8080/api';

// Lấy danh sách bài viết của người dùng
export const getArticles = async (page, articlesPerPage) => {
  try {
    const { userId, token } = await getUserCredentials(); 

    const response = await axios.get(
      `${BASE_URL}/article/${userId}/get-articles/${page}/${articlesPerPage}`,
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
      formData.append('image_files', {
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
      `${BASE_URL}/article/${userId}/post-article`,
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
export const editArticleApi = async (userId, articleId, content, accessStatus, imageFiles = [], videoFile = null) => {
  const { token } = await getUserCredentials();

  const formData = new FormData();
  formData.append('content', content);
  formData.append('access_status', accessStatus);

  // Thêm ảnh vào `FormData` nếu có
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file, index) => {
      formData.append('image_files', {
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
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/article/${userId}/edit-article/${articleId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi sửa bài viết:', error);
    throw error;
  }
};

// Xóa bài viết
export const deleteArticleApi = async (articleId) => {
  try {
    const { userId, token } = await getUserCredentials(); // Lấy userId và token

    const response = await axios.delete(
      `${BASE_URL}/article/delete-article`,
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
    const response = await axios.get(`${BASE_URL}/article/${userId}/get-articles/${page}/${pageSize}`);
    
    // Trả về dữ liệu từ API (giả sử response.data là mảng bài viết)
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy bài viết của người dùng:', error);
    throw error;
  }
};

// Hàm lấy danh sách bài viết màn hình home
export const fetchPosts = async (userId, page, pageSize) => {
  try {
    const { userId } = await getUserCredentials();
    const response = await axios.get(`${BASE_URL}/article/${userId}/get-news/${page}/${pageSize}`);
    if (response.data.code === 1000) {
      return {
        success: true,
        data: response.data.result,
      };
    }
    return { success: false, error: 'Error fetching posts' };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { success: false, error: error.message };
  }
};

// Hàm lấy chi tiết bài viết
export const fetchPostDetail = async (article_id, owner_id) => {
  try {
    const response = await axios.post(`${BASE_URL}/article/detail-article`, {
      article_id,
      owner_id,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.code === 1000) {
      return {
        success: true,
        data: response.data.result,
      };
    }
    return { success: false, error: 'Error fetching post details' };
  } catch (error) {
    console.error("Error fetching post details:", error);
    return { success: false, error: error.message };
  }
};