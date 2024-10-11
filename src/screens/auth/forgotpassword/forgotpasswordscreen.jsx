import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { sendOtpApi } from '../../../api/authapi';  // Import hàm API gửi OTP

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSendOtp = async () => {
    if (!email) {
      return Alert.alert('Lỗi', 'Vui lòng nhập email');
    }

    try {
      // Gọi API để gửi OTP đến email
      const response = await sendOtpApi(email);
      console.log('API Response:', response);  // Log toàn bộ phản hồi từ API để kiểm tra
      
      Alert.alert('Thành công', 'OTP đã được gửi đến email');
      navigation.navigate('OtpScreen', { email });  // Điều hướng đến màn hình nhập OTP
    } catch (error) {
      console.log('Lỗi khi gửi OTP:', error.message);
      Alert.alert('Lỗi', 'Gửi OTP thất bại');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nhập email của bạn"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"  // Thêm kiểu bàn phím email
        autoCapitalize="none"  // Không viết hoa email
      />
      <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
        <Text style={styles.buttonText}>Gửi OTP</Text>
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

export default ForgotPasswordScreen;
