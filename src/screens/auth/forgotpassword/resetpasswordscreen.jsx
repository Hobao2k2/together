import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { resetPasswordApi } from '../../../api/authapi';  // Import API đặt lại mật khẩu

const ResetPasswordScreen = ({ route, navigation }) => {
  const { id, email } = route.params;  // Nhận id và email từ tham số điều hướng
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      return Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
    }

    try {
      console.log('User ID:', id);  // Log id người dùng để kiểm tra

      // Gọi API để đặt lại mật khẩu với password và confirmPassword
      const response = await resetPasswordApi(id, password, confirmPassword);
      console.log('Kết quả đặt lại mật khẩu:', response);  // Log kết quả phản hồi
      Alert.alert('Thành công', 'Mật khẩu đã được thay đổi thành công');
      navigation.navigate('Login');  // Điều hướng về màn hình đăng nhập sau khi thành công
    } catch (error) {
      console.error('Lỗi khi đặt lại mật khẩu:', error);
      Alert.alert('Lỗi', 'Đặt lại mật khẩu thất bại');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Nhập mật khẩu mới cho tài khoản {email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu mới"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { height: 50, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 },
  button: { backgroundColor: '#007BFF', padding: 15, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default ResetPasswordScreen;
