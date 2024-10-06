import axios from 'axios';
import RNFS from 'react-native-fs';
import { zip } from 'react-native-zip-archive';
import uuid from 'react-native-uuid';

// URL của API backend
const API_BASE_URL = '';

// Hàm lấy danh sách bài viết
export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw error;
  }
};

// Hàm xóa bài viết theo id
export const deletePost = async (postId) => {
  try {
    await axios.delete(`${API_BASE_URL}/posts/${postId}`);
  } catch (error) {
    console.error('Failed to delete post:', error);
    throw error;
  }
};

// Hàm đăng bài viết mới
export const submitPost = async (title, content, images, video) => {
  try {
    // Tạo thư mục tạm để lưu file
    const tempDir = `${RNFS.DocumentDirectoryPath}/${uuid.v4()}`;
    await RNFS.mkdir(tempDir);

    // Lưu file text cho bài viết
    const textFilePath = `${tempDir}/post.txt`;
    const postContent = `Title: ${title}\nContent: ${content}`;
    await RNFS.writeFile(textFilePath, postContent, 'utf8');

    // Sao chép ảnh vào thư mục tạm
    const mediaFiles = [textFilePath];
    for (const image of images) {
      const imageDestPath = `${tempDir}/${image.fileName}`;
      await RNFS.copyFile(image.uri, imageDestPath);
      mediaFiles.push(imageDestPath);
    }

    // Sao chép video (nếu có) vào thư mục tạm
    if (video) {
      const videoDestPath = `${tempDir}/${video.fileName}`;
      await RNFS.copyFile(video.uri, videoDestPath);
      mediaFiles.push(videoDestPath);
    }

    // Nén tất cả các file vào một file zip
    const zipFilePath = `${RNFS.DocumentDirectoryPath}/${uuid.v4()}.zip`;
    await zip(tempDir, zipFilePath);

    // Tạo formData để gửi file zip lên backend
    const formData = new FormData();
    formData.append('file', {
      uri: `file://${zipFilePath}`,  // Đảm bảo có `file://` để chỉ định URI
      type: 'application/zip',
      name: 'post.zip',
    });

    // Gửi dữ liệu bài viết lên backend
    const response = await axios.post(`${API_BASE_URL}/posts`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Xóa thư mục tạm sau khi nén xong
    await RNFS.unlink(tempDir);

    return response.data;
  } catch (error) {
    console.error('Failed to submit post:', error);
    throw error;
  }
};
