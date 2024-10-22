import axios from 'axios';
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
export const addArticle = async (content, accessStatus, imageFile, videoFile) => {
  try {
    const { userId, token } = await getUserCredentials(); 

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

    const response = await axios.post(
      `http://14.225.254.35:8080/api/article/{user_id}/post-article`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'multipart/form-data', 
        },
      }
    );

    // Log dữ liệu phản hồi từ server
    console.log('Server Response:', response.data);
  } catch (error) {
    console.error('Error adding article:', error);
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
