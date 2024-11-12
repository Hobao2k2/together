import axios from 'axios';
import { getUserCredentials } from './profileapi';

const BASE_URL = 'http://14.225.254.35:8080/api';

// Hàm tiện ích để tạo header với token
const createHeadersWithToken = async () => {
  const { token } = await getUserCredentials();
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Lấy danh sách bài viết của người dùng
export const getArticles = async (page, articlesPerPage) => {
  try {
    const { userId } = await getUserCredentials();
    const headers = await createHeadersWithToken();

    const response = await axios.get(
      `${BASE_URL}/article/${userId}/get-articles/${page}/${articlesPerPage}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

// Thêm bài viết mới
export const addArticle = async (content, accessStatus, imageFiles, videoFile) => {
  try {
    const { userId } = await getUserCredentials();
    const headers = {
      ...(await createHeadersWithToken()),
      'Content-Type': 'multipart/form-data',
    };

    const formData = new FormData();
    formData.append('content', content);
    formData.append('access_status', accessStatus);

    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file, index) => {
        formData.append('image_files', {
          uri: file.uri,
          name: file.fileName || `image_${index}.jpg`,
          type: file.type || 'image/jpeg',
        });
      });
    }

    if (videoFile && videoFile.uri) {
      formData.append('video_file', {
        uri: videoFile.uri,
        type: videoFile.type || 'video/mp4',
        name: videoFile.fileName || `video_${Date.now()}.mp4`,
      });
    }

    const response = await axios.post(
      `${BASE_URL}/article/${userId}/post-article`,
      formData,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error('Error adding article:', error);
    throw error;
  }
};

// Sửa bài viết
export const editArticleApi = async (userId, articleId, content, accessStatus, imageFiles = [], videoFile = null) => {
  try {
    const headers = {
      ...(await createHeadersWithToken()),
      'Content-Type': 'multipart/form-data',
    };

    const formData = new FormData();
    formData.append('content', content);
    formData.append('access_status', accessStatus);

    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file, index) => {
        formData.append('image_files', {
          uri: file.uri,
          name: file.fileName || `image_${index}.jpg`,
          type: file.type || 'image/jpeg',
        });
      });
    }

    if (videoFile && videoFile.uri) {
      formData.append('video_file', {
        uri: videoFile.uri,
        type: videoFile.type || 'video/mp4',
        name: videoFile.fileName || `video_${Date.now()}.mp4`,
      });
    }

    const response = await axios.post(
      `${BASE_URL}/article/${userId}/edit-article/${articleId}`,
      formData,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error('Error editing article:', error);
    throw error;
  }
};

// Xóa bài viết
export const deleteArticleApi = async (articleId) => {
  try {
    const headers = {
      ...(await createHeadersWithToken()),
      'Content-Type': 'application/json',
    };

    const response = await axios.delete(`${BASE_URL}/article/delete-article`, {
      data: { article_id: articleId },
      headers,
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};

// Lấy các bài viết của người dùng
export const getUserPostsApi = async (page = 0, pageSize = 10) => {
  try {
    const { userId } = await getUserCredentials();
    const headers = await createHeadersWithToken();

    const response = await axios.get(
      `${BASE_URL}/article/${userId}/get-articles/${page}/${pageSize}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

// Lấy danh sách bài viết màn hình home
export const fetchPosts = async (page, pageSize) => {
  try {
    const { userId } = await getUserCredentials();
    const headers = await createHeadersWithToken();

    const response = await axios.get(
      `${BASE_URL}/article/${userId}/get-news/${page}/${pageSize}`,
      { headers }
    );

    if (response.data.code === 1000) {
      return {
        success: true,
        data: response.data.result,
      };
    }
    return { success: false, error: 'Error fetching posts' };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { success: false, error: error.message };
  }
};

// Lấy chi tiết bài viết
export const fetchPostDetail = async (article_id, owner_id) => {
  try {
    const headers = {
      ...(await createHeadersWithToken()),
      'Content-Type': 'application/json',
    };

    const response = await axios.post(
      `${BASE_URL}/article/detail-article`,
      { article_id, owner_id },
      { headers }
    );

    if (response.data.code === 1000) {
      return {
        success: true,
        data: response.data.result,
      };
    }

    return { success: false, error: 'Error fetching post details' };
  } catch (error) {
    console.error('Error fetching post details:', error);
    return { success: false, error: error.message };
  }
};
