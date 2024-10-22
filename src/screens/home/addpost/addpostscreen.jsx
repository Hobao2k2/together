import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { Icon } from 'react-native-elements';
import { addArticle } from '../../../api/postapi'; 
import styles from './addpoststyle';

const AddPostScreen = () => {
  const [content, setContent] = useState('');
  const [accessStatus, setAccessStatus] = useState('PRIVATE');
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectFile = async (fileType) => {
    try {
      const res = await DocumentPicker.pick({
        type: fileType === 'image' ? [DocumentPicker.types.images] : [DocumentPicker.types.video],
      });
      if (fileType === 'image') {
        setImageFile(res);
      } else {
        setVideoFile(res);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.log('Unknown error: ', err);
      }
    }
  };

  const submitPost = async () => {
    if (!content) {
      alert('Please enter some content');
      return;
    }
    
    setLoading(true); 
    try {
      await addArticle(content, accessStatus, imageFile, videoFile);
      alert('Post submitted successfully!');
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

      {/* Chọn ảnh */}
      <TouchableOpacity style={styles.uploadButton} onPress={() => selectFile('image')}>
        <Icon name="image" type="material" color="#fff" />
        <Text style={styles.uploadButtonText}>Select Image</Text>
      </TouchableOpacity>
      {imageFile && <Text>Selected Image: {imageFile[0].name}</Text>}

      {/* Chọn video */}
      <TouchableOpacity style={styles.uploadButton} onPress={() => selectFile('video')}>
        <Icon name="videocam" type="material" color="#fff" />
        <Text style={styles.uploadButtonText}>Select Video</Text>
      </TouchableOpacity>
      {videoFile && <Text>Selected Video: {videoFile[0].name}</Text>}

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
