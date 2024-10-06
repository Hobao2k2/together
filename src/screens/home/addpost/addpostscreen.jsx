import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import RNFS from 'react-native-fs';  // File system library to work with files
import { zip } from 'react-native-zip-archive'; // Import zip utility
import uuid from 'react-native-uuid'; // To generate a unique file name for the zip

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB (đổi sang bytes)

const AddPostScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [totalSize, setTotalSize] = useState(0); // Dung lượng hiện tại

  const checkTotalSize = (newSize) => {
    return (totalSize + newSize) <= MAX_FILE_SIZE;
  };

  const handleAddImage = () => {
    if (images.length >= 5) {
      Alert.alert('Thông báo', 'Bạn chỉ có thể thêm tối đa 5 ảnh.');
      return;
    }

    const options = {
      mediaType: 'photo',
      selectionLimit: 0, // Cho phép chọn nhiều ảnh
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else {
        let newSize = 0;
        const selectedImages = response.assets.map(asset => {
          newSize += asset.fileSize; // Tính tổng kích thước ảnh đã chọn
          return {
            uri: asset.uri,
            fileName: asset.fileName,
            fileSize: asset.fileSize,
          };
        });

        if (!checkTotalSize(newSize)) {
          Alert.alert('Thông báo', 'Tổng dung lượng ảnh và video vượt quá 25MB.');
        } else {
          setImages([...images, ...selectedImages]);
          setTotalSize(totalSize + newSize);
        }
      }
    });
  };

  const handleAddVideo = () => {
    if (video) {
      Alert.alert('Thông báo', 'Bạn chỉ có thể thêm 1 video.');
      return;
    }

    const options = {
      mediaType: 'video',
      selectionLimit: 1, // Chỉ cho phép chọn 1 video
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.errorCode) {
        console.error('VideoPicker Error: ', response.errorMessage);
      } else {
        const selectedVideo = {
          uri: response.assets[0].uri,
          fileName: response.assets[0].fileName,
          fileSize: response.assets[0].fileSize,
        };

        if (!checkTotalSize(selectedVideo.fileSize)) {
          Alert.alert('Thông báo', 'Tổng dung lượng ảnh và video vượt quá 25MB.');
        } else {
          setVideo(selectedVideo);
          setTotalSize(totalSize + selectedVideo.fileSize);
        }
      }
    });
  };

  // Hàm nén bài viết và gửi lên backend
  const handleAddPost = async () => {
    if (title === '' || content === '') {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ tiêu đề và nội dung');
      return;
    }

    try {
      // Tạo thư mục tạm để lưu file
      const tempDir = `${RNFS.DocumentDirectoryPath}/${uuid.v4()}`;
      await RNFS.mkdir(tempDir);

      // Lưu file text cho bài viết
      const textFilePath = `${tempDir}/post.txt`;
      const postContent = `Title: ${title}\nContent: ${content}`;
      await RNFS.writeFile(textFilePath, postContent, 'utf8');

      // Sao chép ảnh vào thư mục tạm
      const mediaFiles = [textFilePath];
      for (const image of images) {
        const imageDestPath = `${tempDir}/${image.fileName}`;
        await RNFS.copyFile(image.uri, imageDestPath);
        mediaFiles.push(imageDestPath);
      }

      // Sao chép video (nếu có) vào thư mục tạm
      if (video) {
        const videoDestPath = `${tempDir}/${video.fileName}`;
        await RNFS.copyFile(video.uri, videoDestPath);
        mediaFiles.push(videoDestPath);
      }

      // Nén tất cả các file vào một file zip
      const zipFilePath = `${RNFS.DocumentDirectoryPath}/${uuid.v4()}.zip`;
      await zip(tempDir, zipFilePath);

      // Gửi file zip lên backend
      const formData = new FormData();
      formData.append('file', {
        uri: `file://${zipFilePath}`,  // Đảm bảo có `file://` để chỉ định URI
        type: 'application/zip',
        name: 'post.zip',
      });

      const response = await axios.post('https://api.example.com/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Thành công', 'Bài viết đã được thêm');
      navigation.goBack(); // Quay lại màn hình Home

      // Xóa thư mục tạm sau khi nén xong
      await RNFS.unlink(tempDir);

    } catch (error) {
      console.error('Failed to add post:', error);
      Alert.alert('Lỗi', 'Không thể thêm bài viết');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Tiêu đề</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tiêu đề"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Nội dung</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Nhập nội dung"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={5}
      />
      
      <View style={styles.mediaContainer}>
        <Text style={styles.label}>Hình ảnh:</Text>
        <ScrollView horizontal>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image.uri }} style={styles.imagePreview} />
          ))}
        </ScrollView>
        <Button title="Thêm ảnh" onPress={handleAddImage} />
      </View>

      <View style={styles.mediaContainer}>
        <Text style={styles.label}>Video:</Text>
        {video ? (
          <Text>{video.fileName}</Text>
        ) : (
          <Text>Chưa thêm video</Text>
        )}
        <Button title="Thêm video" onPress={handleAddVideo} />
      </View>

      <Button title="Thêm bài viết" onPress={handleAddPost} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
  },
  textArea: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  mediaContainer: {
    marginBottom: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
});

export default AddPostScreen;
