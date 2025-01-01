import axios from 'axios';
import { getUserCredentials } from './profileapi'; 

// Base URL
const BASE_URL = "http://10.0.88.20:8080/api";

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
        
        // Log response data
        console.log("API Response:", response.data);

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
        console.log("comment log:", data);
        if (parentCommentId) {
            data.parent_comment_id = parentCommentId;
        }
        const response = await axios.post(`${BASE_URL}/comment/post-comment`, data, 
            { headers });
        // Log response data
        console.log("API Response:", response.data);
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
        // Log response data
        console.log("API Response:", response.data);
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
        // Log response data
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa comment:", error.response?.data || error.message);
        throw error;
    }
};

// 5. Get Comments and Comment Count API
export const fetchCommentsApi = async (articleId, offset = 0, pageSize = 10) => {
    try {
        const headers = await createHeadersWithToken();
        const response = await axios.get(
            `${BASE_URL}/comment/get-comments-article/${articleId}/${offset}/${pageSize}`,
            { headers }
        );

        // Log response data
        console.log("API Response:", response.data);
        
        // Trả về danh sách bình luận và tổng số bình luận
        return response.data; // Ví dụ, trả về { comments, total_comments }
    } catch (error) {
        console.error("Lỗi khi lấy danh sách comment:", error.response?.data || error.message);
        throw error;
    }
};
