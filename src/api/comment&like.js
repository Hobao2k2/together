import axios from 'axios';
import { getUserCredentials } from './profileapi'; 

// Base URL
const BASE_URL = "http://14.225.254.35:8080/api";

// Hàm tiện ích để tạo header với token
const createHeadersWithToken = async () => {
    const { token } = await getUserCredentials(); // Giả sử bạn đã có hàm lấy token
    return {
        Authorization: `Bearer ${token}`,
    };
};

// 1. Like Article API
export const likeArticleApi = async (userId, articleId, liked) => {
    try {
        const headers = await createHeadersWithToken();
        const response = await axios.post(
            `${BASE_URL}/reaction/like-article`,
            { user_id: userId, article_id: articleId, liked },
            { headers }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi like/bỏ like bài viết:", error.response?.data || error.message);
        throw error;
    }
};

// 2. Post Comment API
export const postCommentApi = async (articleId, content, userId, parentCommentId = null) => {
    try {
        const headers = await createHeadersWithToken();
        const data = { article_id: articleId, content, user_id: userId };
        if (parentCommentId) {
            data.parent_comment_id = parentCommentId;
        }
        const response = await axios.post(`${BASE_URL}/comment/post-comment`, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi đăng comment:", error.response?.data || error.message);
        throw error;
    }
};

// 3. Edit Comment API
export const editCommentApi = async (articleId, content, commentId) => {
    try {
        const headers = await createHeadersWithToken();
        const response = await axios.put(
            `${BASE_URL}/comment/edit-comment`,
            { article_id: articleId, content, comment_id: commentId },
            { headers }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi sửa comment:", error.response?.data || error.message);
        throw error;
    }
};

// 4. Delete Comment API
export const deleteCommentApi = async (articleId, commentId) => {
    try {
        const headers = await createHeadersWithToken();
        const response = await axios.delete(`${BASE_URL}/comment/delete-comment`, {
            headers,
            data: { article_id: articleId, comment_id: commentId },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa comment:", error.response?.data || error.message);
        throw error;
    }
};
