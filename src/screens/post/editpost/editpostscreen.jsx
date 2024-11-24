import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';
import { editArticleApi } from '../../../api/postapi';
import Toast from 'react-native-toast-message';
import styles from './editpoststyle';

const MAX_TOTAL_SIZE_MB = 10; // Giới hạn dung lượng tối đa 10MB

const EditPostScreen = ({ route, navigation }) => {
  const { articleId, userId, content, accessStatus, images, video } = route.params;

  const [newContent, setNewContent] = useState(content || '');
  const [newAccessStatus, setNewAccessStatus] = useState(accessStatus || 'PRIVATE');
  const [imageFiles, setImageFiles] = useState(images || []);
  const [videoFile, setVideoFile] = useState(video || null);
  const [loading, setLoading] = useState(false);

  // Hàm tính tổng dung lượng
  const calculateTotalSize = () => {
    const imageSize = imageFiles.reduce((total, file) => total + (file.fileSize || 0), 0);
    const videoSize = videoFile?.fileSize || 0;
    return (imageSize + videoSize) / (1024 * 1024); // Chuyển sang MB
  };

  // Hàm chọn thêm ảnh mới
  const selectImages = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 5 }, (response) => {
      if (!response.didCancel && response.assets) {
        const newImages = response.assets;
        const newTotalSize =
          calculateTotalSize() +
          newImages.reduce((total, file) => total + (file.fileSize || 0), 0) / (1024 * 1024);
  
        if (newTotalSize > MAX_TOTAL_SIZE_MB) {
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: `Tổng dung lượng ảnh và video không được vượt quá ${MAX_TOTAL_SIZE_MB}MB.`,
          });
        } else {
          setImageFiles([...imageFiles, ...newImages]);
        }
      }
    });
  };  

  // Hàm chọn video mới
  const selectVideo = () => {
    launchImageLibrary({ mediaType: 'video' }, (response) => {
      if (!response.didCancel && response.assets) {
        const newVideo = response.assets[0];
        const newTotalSize = calculateTotalSize() + (newVideo.fileSize || 0) / (1024 * 1024);
  
        if (newTotalSize > MAX_TOTAL_SIZE_MB) {
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: `Tổng dung lượng ảnh và video không được vượt quá ${MAX_TOTAL_SIZE_MB}MB.`,
          });
        } else if (videoFile) {
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: 'Chỉ được thêm một video.',
          });
        } else {
          setVideoFile(newVideo);
        }
      }
    });
  };  

  // Hàm xóa ảnh
  const removeImage = (index) => {
    const updatedImages = [...imageFiles];
    updatedImages.splice(index, 1);
    setImageFiles(updatedImages);
  
    Toast.show({
      type: 'info',
      text1: 'Xóa ảnh',
      text2: 'Ảnh đã được xóa.',
    });
  };  

  // Hàm xóa video
  const removeVideo = () => {
    setVideoFile(null);
  
    Toast.show({
      type: 'info',
      text1: 'Xóa video',
      text2: 'Video đã được xóa.',
    });
  };  

  // Hàm xử lý sửa bài viết
  const handleEditPost = async () => {
    if (!newContent.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Nội dung bài viết không được để trống.',
      });
      return;
    }
  
    if (calculateTotalSize() > MAX_TOTAL_SIZE_MB) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: `Tổng dung lượng ảnh và video không được vượt quá ${MAX_TOTAL_SIZE_MB}MB.`,
      });
      return;
    }
  
    setLoading(true);
    try {
      await editArticleApi(userId, articleId, newContent, newAccessStatus, imageFiles, videoFile);
  
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Bài viết đã được cập nhật!',
      });
  
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi sửa bài viết:', error);
  
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể sửa bài viết.',
      });
    } finally {
      setLoading(false);
    }
  };  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Chỉnh sửa bài viết</Text>

      {/* Nội dung bài viết */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Nội dung bài viết"
          value={newContent}
          onChangeText={setNewContent}
          multiline
        />
      </View>

      {/* Trạng thái truy cập */}
      <View style={styles.accessStatusContainer}>
        <TouchableOpacity
          style={[styles.statusButton, newAccessStatus === 'PRIVATE' && styles.selectedStatusButton]}
          onPress={() => setNewAccessStatus('PRIVATE')}
        >
          <Text style={[styles.statusButtonText, newAccessStatus === 'PRIVATE' && styles.selectedStatusText]}>
            PRIVATE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusButton, newAccessStatus === 'FRIEND' && styles.selectedStatusButton]}
          onPress={() => setNewAccessStatus('FRIEND')}
        >
          <Text style={[styles.statusButtonText, newAccessStatus === 'FRIEND' && styles.selectedStatusText]}>
            FRIEND
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ảnh hiện tại */}
      <Text style={styles.sectionTitle}>Hình ảnh:</Text>
      <View style={styles.imagePreviewContainer}>
        {imageFiles.map((file, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: file.uri }} style={styles.imageThumbnail} />
            <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.uploadButton} onPress={selectImages}>
        <Text style={styles.uploadButtonText}>Thêm hình ảnh</Text>
      </TouchableOpacity>

      {/* Video hiện tại */}
      <Text style={styles.sectionTitle}>Video:</Text>
      {videoFile ? (
        <View style={styles.videoWrapper}>
          <Video source={{ uri: videoFile.uri }} style={styles.videoThumbnail} controls />
          <TouchableOpacity style={styles.removeButton} onPress={removeVideo}>
            <Text style={styles.removeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={selectVideo}>
          <Text style={styles.uploadButtonText}>Thêm video</Text>
        </TouchableOpacity>
      )}

      {/* Nút lưu thay đổi */}
      <TouchableOpacity style={styles.submitButton} onPress={handleEditPost} disabled={loading}>
        <Text style={styles.submitButtonText}>{loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditPostScreen;
