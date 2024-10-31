import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';
import { editArticleApi } from '../../api/postapi';
import styles from './editpoststyle';

const EditPostScreen = ({ route, navigation }) => {
  const { articleId, userId, content, accessStatus, images, video } = route.params;

  // Khởi tạo các state cho nội dung, trạng thái truy cập, ảnh và video
  const [newContent, setNewContent] = useState(content);
  const [newAccessStatus, setNewAccessStatus] = useState(accessStatus);
  const [imageFiles, setImageFiles] = useState(images || []);
  const [videoFile, setVideoFile] = useState(video || null);
  const [loading, setLoading] = useState(false);

  // Hàm chọn ảnh mới
  const selectImages = () => {
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 5 },
      (response) => {
        if (!response.didCancel && response.assets) {
          setImageFiles([...imageFiles, ...response.assets]);
        }
      }
    );
  };

  // Hàm chọn video mới
  const selectVideo = () => {
    launchImageLibrary(
      { mediaType: 'video' },
      (response) => {
        if (!response.didCancel && response.assets) {
          setVideoFile(response.assets[0]);
        }
      }
    );
  };

  // Hàm xử lý sự kiện sửa bài viết
  const handleEditPost = async () => {
    setLoading(true);
    try {
      await editArticleApi(userId, articleId, newContent, newAccessStatus, imageFiles, videoFile);
      Alert.alert("Thành công", "Bài viết đã được cập nhật!");
      navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi sửa bài viết:", error);
      Alert.alert("Lỗi", "Không thể sửa bài viết");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Chỉnh sửa bài viết</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Nội dung bài viết"
          value={newContent}
          onChangeText={setNewContent}
          multiline
        />
      </View>

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

      <TouchableOpacity style={styles.uploadButton} onPress={selectImages}>
        <Text style={styles.uploadButtonText}>Thêm hình ảnh</Text>
      </TouchableOpacity>

      {imageFiles.length > 0 && (
        <View style={styles.imagePreviewContainer}>
          {imageFiles.map((file, index) => (
            <Image key={index} source={{ uri: file.uri }} style={styles.imageThumbnail} />
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.uploadButton} onPress={selectVideo}>
        <Text style={styles.uploadButtonText}>Thêm video</Text>
      </TouchableOpacity>

      {videoFile && (
        <View style={styles.videoPreviewContainer}>
          <Video source={{ uri: videoFile.uri }} style={styles.videoThumbnail} controls />
        </View>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleEditPost} disabled={loading}>
        <Text style={styles.submitButtonText}>{loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditPostScreen;
