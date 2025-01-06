import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 5,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 60,
    marginLeft: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    marginLeft: 12,
    fontSize: 16,
    marginVertical: 10,
  },
  video: {
    width: width - 40,
    height: 300,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
  },
  image: {
    width: width - 40,
    height: 300,
    borderRadius: 10,
    alignSelf: 'center',
  },
  mediaWrapper: {
    position: 'relative',
  },
  indexLabel: {
    position: 'absolute',
    top: 20,
    right: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
    marginTop: 10,
  },
  interaction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionContent: {
    paddingHorizontal: 5,
    marginLeft: 10
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 50,  // Để tránh nội dung bị che khuất khi bàn phím xuất hiện
  },
  menuContainer: {
    position: 'absolute',
    top: 5, // Điều chỉnh vị trí menu gần nút bấm
    right: '30%',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: 'row', // Đặt icon và text trên cùng một hàng
    alignItems: 'center', // Căn giữa icon và text theo chiều dọc
    paddingVertical: 5, // Giảm padding
    paddingHorizontal: 8, // Giảm padding
    justifyContent: 'flex-start', // Đảm bảo các phần tử căn trái
  },
  menuText: {
    marginLeft: 8, // Khoảng cách giữa icon và text
    fontSize: 16,
    color: '#333',
  },
  commentsContainer: {
    flex: 1,
    marginTop: 20,
    marginBottom: 40,
    marginHorizontal: 20,
  },
  comment: {
    marginBottom: 15,
  },
  commentHeader: {
    flexDirection: 'row', // Đặt các phần tử (avatar, username, menu button) trên cùng một dòng
    alignItems: 'center', // Canh chỉnh theo chiều dọc
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  usernameMenuContainer: {
    flexDirection: 'row', // Các phần tử username và menu button nằm cùng dòng
    alignItems: 'center', // Canh chỉnh theo chiều dọc
    marginLeft: 10, // Khoảng cách giữa avatar và tên người dùng
  },
  commentUsername: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuButton: {
    marginLeft: 10,
  },
  menupostContainer: {
    position: 'absolute',
    top: 50, // Điều chỉnh cho phù hợp với giao diện
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  menupostOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  menupostText: {
    marginLeft: 10,
    fontSize: 14,
  },
  commentTextContainer: {
    marginTop: 10, // Đảm bảo khoảng cách giữa tên và nội dung bình luận
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  
  childComment: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 40,         // Thụt lề cho bình luận con
    marginTop: 5,           // Khoảng cách giữa bình luận cha và bình luận con
  },

    // Style cho phần nhập bình luận (addCommentContainer)
    addCommentContainer: {
      position: 'absolute',
      bottom: 0,  // Đưa ô nhập bình luận lên gần dưới cùng, khoảng cách từ dưới cùng là 20
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: '#ddd',
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 1000,  // Đảm bảo phần này luôn nằm trên các phần khác
    },
  
    replyingToText: {
      position: 'absolute',
      bottom: 70,  // Đặt nó ngay trên phần nhập bình luận, khoảng cách 70px từ dưới
      left: 0,     // Đặt từ trái
      right: 0,    // Đặt từ phải
      fontSize: 14,
      color: '#555',
      fontStyle: 'italic',
      zIndex: 1001, // Đảm bảo không bị che khuất
      textAlign: 'center',  // Căn giữa chữ theo chiều ngang
      paddingTop: 5,        // Khoảng cách trên chữ
      paddingLeft: 0,       // Bỏ paddingLeft để căn chính giữa
      paddingRight: 0,      // Bỏ paddingRight để căn chính giữa
    },
    
  commentInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    paddingLeft: 15,
    paddingRight: 15,
  },
  commentButton: {
    marginLeft: 10,
    backgroundColor: '#6200ea', // Màu nền của nút gửi
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentButtonText: {
    color: '#fff', // Màu chữ của nút
    fontSize: 16,
    fontWeight: 'bold', // Chữ đậm cho dễ nhìn
  },
  // Bình luận con
  childCommentsContainer: {
    marginTop: 10,
    marginLeft: 30, // Thụt lề để phân biệt bình luận con
  },
  childComment: {
    marginBottom: 10,
  },
  replyButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  replyButtonText: {
    fontSize: 14,
    color: '#007bff',
  },
  childCommentsContainer: {
    marginLeft: 20, // Thụt vào so với bình luận cha
    marginTop: 10,
  },
  childComment: {
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  commentText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  // Modal Styles
modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Lớp nền mờ
  paddingHorizontal: 20,
},

modalContent: {
  backgroundColor: '#fff',
  padding: 25,
  borderRadius: 12, // Thêm góc bo tròn mềm mại
  width: '90%', // Sử dụng phần trăm để modal phản hồi với các kích thước màn hình khác nhau
  maxWidth: 400, // Giới hạn chiều rộng tối đa để không quá rộng trên màn hình lớn
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5, // Tạo hiệu ứng đổ bóng cho modal
},

modalInput: {
  width: '100%',
  height: 45,
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 8, // Tăng độ bo góc của ô nhập liệu
  marginBottom: 20,
  paddingLeft: 15, // Tăng khoảng cách chữ khỏi viền
  fontSize: 16, // Thay đổi kích thước chữ cho dễ nhìn
  color: '#333', // Thêm màu chữ để dễ đọc hơn
},

modalButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: 15, // Thêm khoảng cách giữa phần nội dung và các nút
},

modalButton: {
  backgroundColor: '#FFA500', // Màu cam cho nền
  paddingVertical: 12,
  paddingHorizontal: 25,
  borderRadius: 8,
  marginHorizontal: 5,
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: 120, // Đảm bảo nút đủ rộng cho text
},

modalButtonText: {
  color: '#fff', // Màu trắng cho chữ
  fontSize: 16,
  fontWeight: '600', // Độ đậm chữ
},

cancelButton: {
  backgroundColor: '#ccc', // Màu xám nhạt cho nút hủy
},

updateButton: {
  backgroundColor: '#4CAF50', // Màu xanh lá cho nút cập nhật
},

deleteButton: {
  backgroundColor: '#e74c3c', // Màu đỏ cho nút xóa
},
  
  // Menu Button (Nút chỉnh sửa/xóa)
  menuButton: {
    marginHorizontal: 5,
  },
  
  menupostContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  
  menupostOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  
  menupostText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  commentTextContainer: {
    marginTop: 8,           // Khoảng cách giữa tên người dùng và nội dung bình luận
    paddingHorizontal: 10,  // Padding cho phần nội dung để văn bản không dính vào cạnh
  },
  
  commentText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,         // Điều chỉnh line height để nội dung dễ đọc hơn
    flexWrap: 'wrap',       // Cho phép văn bản xuống dòng khi cần thiết
    width: '100%',          // Đảm bảo nội dung chiếm toàn bộ chiều rộng
  }  
});

export default styles;
