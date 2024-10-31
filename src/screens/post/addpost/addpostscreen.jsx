import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import { addArticle } from '../../../api/postapi';
import Video from 'react-native-video';
import { launchImageLibrary } from 'react-native-image-picker';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import styles from './addpoststyle';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const AddPostScreen = () => {
  const [content, setContent] = useState('');
  const [accessStatus, setAccessStatus] = useState('PRIVATE');
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateTotalSize = (files, video) => {
    let totalSize = files.reduce((acc, file) => acc + file.fileSize, 0);
    if (video) totalSize += video.fileSize;
    return totalSize;
  };

  const selectImages = () => {
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 5 },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) return console.error('Image Picker Error:', response.errorMessage);

        const validFiles = response.assets.filter(file => file.uri && file.fileName && file.type);
        const newFiles = [...imageFiles, ...validFiles];
        const totalSize = calculateTotalSize(newFiles, videoFile);

        if (totalSize > MAX_FILE_SIZE) {
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: 'Dung lượng vượt quá giới hạn 10MB'
          });
        } else {
          setImageFiles(newFiles);
        }
      }
    );
  };

  const selectVideo = () => {
    launchImageLibrary(
      { mediaType: 'video' },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) return console.error('Video Picker Error:', response.errorMessage);

        const video = response.assets[0];
        const totalSize = calculateTotalSize(imageFiles, video);

        if (totalSize > MAX_FILE_SIZE) {
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: 'Dung lượng vượt quá giới hạn 10MB'
          });
        } else {
          setVideoFile(video);
        }
      }
    );
  };

  const removeImage = (index) => {
    setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const submitPost = async () => {
    if (!content) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Vui lòng nhập nội dung bài viết'
      });
      return;
    }
    
    setLoading(true);
    try {
      await addArticle(content, accessStatus, imageFiles, videoFile);
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Đã đăng bài thành công!'
      });
      setContent('');
      setAccessStatus('PRIVATE');
      setImageFiles([]);
      setVideoFile(null);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể đăng bài'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Đăng bài viết</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Nội dung"
          value={content}
          onChangeText={setContent}
          multiline
        />
      </View>

      <View style={styles.accessStatusContainer}>
        <TouchableOpacity
          style={[styles.statusButton, accessStatus === 'PRIVATE' && styles.selectedStatusButton]}
          onPress={() => setAccessStatus('PRIVATE')}
        >
          <Text style={[styles.statusButtonText, accessStatus === 'PRIVATE' && styles.selectedStatusText]}>
            Chỉ mình tôi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusButton, accessStatus === 'FRIEND' && styles.selectedStatusButton]}
          onPress={() => setAccessStatus('FRIEND')}
        >
          <Text style={[styles.statusButtonText, accessStatus === 'FRIEND' && styles.selectedStatusText]}>
            Bạn bè
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={selectImages}>
        <Icon name="image" type="material" color="#fff" />
        <Text style={styles.uploadButtonText}>Thêm ảnh</Text>
      </TouchableOpacity>

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

      <TouchableOpacity style={styles.uploadButton} onPress={selectVideo}>
        <Icon name="videocam" type="material" color="#fff" />
        <Text style={styles.uploadButtonText}>Thêm video</Text>
      </TouchableOpacity>

      {videoFile && (
        <View style={styles.videoPreviewContainer}>
          <Text>Selected Video: {videoFile.fileName}</Text>
          <Video
            source={{ uri: videoFile.uri }}
            style={styles.videoThumbnail}
            controls
            resizeMode="cover"
          />
        </View>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={submitPost} disabled={loading}>
        {loading ? (
          <LottieView
            source={require('../../../../assets/animation/loading.json')}
            autoPlay
            loop
            style={{ width: 50, height: 50 }}
          />
        ) : (
          <Text style={styles.submitButtonText}>Đăng</Text>
        )}
      </TouchableOpacity>

      {/* Thêm Toast vào JSX */}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </ScrollView>
  );
};

export default AddPostScreen;
