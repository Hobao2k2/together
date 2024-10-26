import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { Icon } from 'react-native-elements';
import { addArticle } from '../../../api/postapi'; 
import styles from './addpoststyle';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const AddPostScreen = () => {
  const [content, setContent] = useState('');
  const [accessStatus, setAccessStatus] = useState('PRIVATE');
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Tính tổng kích thước của các tệp
  const calculateTotalSize = (files, video) => {
    let totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (video) totalSize += video.size;
    return totalSize;
  };

  const selectImages = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        allowMultiSelection: true, // Cho phép chọn nhiều ảnh
      });
  
      const newFiles = [...imageFiles, ...res];
      const totalSize = calculateTotalSize(newFiles, videoFile);
  
      if (totalSize > MAX_FILE_SIZE) {
        Alert.alert('Dung lượng vượt quá giới hạn 10MB');
      } else {
        setImageFiles(newFiles); // Chỉ thêm ảnh nếu dung lượng hợp lệ
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled image picker');
      } else {
        console.log('Unknown error: ', err);
      }
    }
  };  

  const selectVideo = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
      console.log('Selected video file:', res); // Log thông tin video ngay sau khi chọn
      setVideoFile(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled video picker');
      } else {
        console.error('Unknown error selecting video:', err);
      }
    }
  };  

  // Hàm xóa ảnh khỏi danh sách
  const removeImage = (index) => {
    setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const submitPost = async () => {
    if (!content) {
      alert('Please enter some content');
      return;
    }

    setLoading(true); 
    try {
      await addArticle(content, accessStatus, imageFiles, videoFile);
      alert('Post submitted successfully!');
      // Reset màn hình sau khi đăng thành công
      setContent('');
      setAccessStatus('PRIVATE');
      setImageFiles([]);
      setVideoFile(null);
    } catch (error) {
      alert('Failed to submit post');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create a New Post</Text>

      {/* Nội dung bài viết */}
      <View style={styles.inputContainer}>
        <Icon name="edit" type="material" color="#000" />
        <TextInput
          style={styles.textInput}
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          multiline
        />
      </View>

      {/* Trạng thái truy cập */}
      <View style={styles.accessStatusContainer}>
        <TouchableOpacity
          style={[styles.statusButton, accessStatus === 'PRIVATE' && styles.selectedStatusButton]}
          onPress={() => setAccessStatus('PRIVATE')}
        >
          <Text style={[styles.statusButtonText, accessStatus === 'PRIVATE' && styles.selectedStatusText]}>
            PRIVATE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusButton, accessStatus === 'FRIEND' && styles.selectedStatusButton]}
          onPress={() => setAccessStatus('FRIEND')}
        >
          <Text style={[styles.statusButtonText, accessStatus === 'FRIEND' && styles.selectedStatusText]}>
            FRIEND
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chọn nhiều ảnh */}
      <TouchableOpacity style={styles.uploadButton} onPress={selectImages}>
        <Icon name="image" type="material" color="#fff" />
        <Text style={styles.uploadButtonText}>Select Images</Text>
      </TouchableOpacity>

      {/* Hiển thị các ảnh đã chọn */}
      {imageFiles.length > 0 && (
        <View style={styles.imagePreviewContainer}>
          {imageFiles.map((file, index) => (
            <View key={index} style={styles.imagePreview}>
              <Image source={{ uri: file.uri }} style={styles.imageThumbnail} />
              <TouchableOpacity onPress={() => removeImage(index)} style={styles.removeButton}>
                <Icon name="close" type="material" color="#fff" size={16} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Chọn video */}
      <TouchableOpacity style={styles.uploadButton} onPress={selectVideo}>
        <Icon name="videocam" type="material" color="#fff" />
        <Text style={styles.uploadButtonText}>Select Video</Text>
      </TouchableOpacity>
      {videoFile && <Text>Selected Video: {videoFile.name}</Text>}

      {/* Nút submit */}
      <TouchableOpacity style={styles.submitButton} onPress={submitPost} disabled={loading}>
        <Text style={styles.submitButtonText}>
          {loading ? 'Posting...' : 'Post'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddPostScreen;
