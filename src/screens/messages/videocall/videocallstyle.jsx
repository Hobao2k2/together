import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Nền đen cho giao diện video call
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject, // Video nền bao phủ toàn màn hình
    zIndex: -1, // Đặt video nền ở phía sau
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Lớp phủ hiển thị phía trên
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Hiệu ứng mờ để làm nổi bật nội dung
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  incomingCallText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  callingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  rejectedText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  localVideo: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 120,
    height: 160,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  circularButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30, // Hình tròn
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 4,
  },
  acceptButton: {
    backgroundColor: '#4CAF50', // Màu xanh lá cho nút chấp nhận
  },
  rejectButton: {
    backgroundColor: '#F44336', // Màu đỏ cho nút từ chối
  },
  endCallButton: {
    backgroundColor: '#F44336', // Màu đỏ cho nút kết thúc
    marginTop: 20,
    padding: 15,
    borderRadius: 30,
  },
  backButton: {
    backgroundColor: '#007BFF', // Màu xanh dương cho nút quay lại
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
  },
});

export default styles;
