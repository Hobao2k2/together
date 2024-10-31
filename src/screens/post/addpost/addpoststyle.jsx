import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fd', // Màu nền nhạt tạo cảm giác dễ chịu
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3b3b3b',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#d1d9e6',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#ffffff',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  textInput: {
    fontSize: 18,
    color: '#4b4b4b',
    textAlignVertical: 'top',
  },
  accessStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  statusButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#e6edf7',
  },
  selectedStatusButton: {
    backgroundColor: '#5a9ff7', // Màu xanh nổi bật cho trạng thái đã chọn
  },
  statusButtonText: {
    fontSize: 16,
    color: '#6b7a8e',
  },
  selectedStatusText: {
    color: '#ffffff', // Văn bản trắng khi trạng thái được chọn
    fontWeight: 'bold',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6a82fb', // Gradient màu nhẹ nhàng
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#6a82fb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  uploadButtonText: {
    marginLeft: 10,
    color: '#fff', // Văn bản màu trắng để nổi bật
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 20,
  },
  imagePreview: {
    position: 'relative',
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e8eaf0',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageThumbnail: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 3,
  },
  videoPreviewContainer: {
    marginTop: 10,
    backgroundColor: '#e8eaf0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: '#56ab2f', // Gradient màu xanh cho nút đăng
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#56ab2f',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff', // Văn bản trắng
    fontSize: 18,
    fontWeight: '700',
  },
});

export default styles;
