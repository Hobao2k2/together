import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f2f5fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#d1d9e6',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  textInput: {
    fontSize: 16,
    color: '#333',
  },
  accessStatusContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statusButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#e6edf7',
    marginHorizontal: 5,
  },
  selectedStatusButton: {
    backgroundColor: '#4a90e2',
  },
  statusButtonText: {
    fontSize: 16,
    color: '#6c7c8e',
  },
  selectedStatusText: {
    color: '#fff',
  },
  uploadButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 5,
  },
  videoPreviewContainer: {
    marginTop: 10,
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default styles;
