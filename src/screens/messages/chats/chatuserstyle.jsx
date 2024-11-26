import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Màu nền chung cho màn hình
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#007bff', // Màu nền xanh
    borderRadius: 20, // Hình tròn
    justifyContent: 'center',
    alignItems: 'center', // Căn giữa mũi tên
    margin: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    maxWidth: '75%', // Tin nhắn không chiếm toàn bộ chiều ngang
  },
  senderMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff', // Màu tin nhắn người gửi
    borderRadius: 8,
  },
  receiverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e1e1e1', // Màu tin nhắn người nhận
    borderRadius: 8,
  },
  messageText: {
    fontSize: 16,
    color: '#fff', // Màu chữ người gửi
  },
  timestamp: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles;
