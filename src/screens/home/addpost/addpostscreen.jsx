import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { addArticle } from '../../../api/postapi';
import Video from 'react-native-video';
import { launchImageLibrary } from 'react-native-image-picker';
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
      {
        mediaType: 'photo',
        selectionLimit: 5,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.error('Image Picker Error:', response.errorMessage);
        } else {
          const validFiles = response.assets.filter(
            file => file.uri && file.fileName && file.type
          );

          const newFiles = [...imageFiles, ...validFiles];
          const totalSize = calculateTotalSize(newFiles, videoFile);

          if (totalSize > MAX_FILE_SIZE) {
            Alert.alert('Dung lượng vượt quá giới hạn 10MB');
          } else {
            setImageFiles(newFiles);
            console.log("Selected image files:", newFiles); // Log chi tiết các ảnh
          }
        }
      }
    );
  };

  const selectVideo = () => {
    launchImageLibrary(
      {
        mediaType: 'video',
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled video picker');
        } else if (response.errorCode) {
          console.error('Video Picker Error:', response.errorMessage);
        } else {
          const video = response.assets[0];
          console.log("Selected video file:", video); // Log chi tiết video
          const totalSize = calculateTotalSize(imageFiles, video);

          if (totalSize > MAX_FILE_SIZE) {
            Alert.alert('Dung lượng vượt quá giới hạn 10MB');
          } else {
            setVideoFile(video); // Thêm video vào state
          }
        }
      }
    );
  };

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

      <TouchableOpacity style={styles.uploadButton} onPress={selectImages}>
        <Icon name="image" type="material" color="#fff" />
        <Text style={styles.uploadButtonText}>Select Images</Text>
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
        <Text style={styles.uploadButtonText}>Select Video</Text>
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
        <Text style={styles.submitButtonText}>
          {loading ? 'Posting...' : 'Post'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddPostScreen;
