import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { verifyOtpApi } from '../../../api/authapi';  // Import API xác thực OTP

const OtpScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown(countdown - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      return Alert.alert('Lỗi', 'OTP phải gồm 6 chữ số');
    }

    try {
      // Gọi API để xác thực OTP
      const response = await verifyOtpApi(email, otp);
      console.log('Kết quả xác thực OTP:', response); // Log kết quả để kiểm tra

      // Lấy userId từ response.result
      const userId = response.result;

      if (!userId) {
        throw new Error('Không nhận được id người dùng');
      }

      Alert.alert('Thành công', 'Xác thực OTP thành công');
      
      // Điều hướng đến ResetPasswordScreen và truyền userId cùng với email
      navigation.navigate('ResetPasswordScreen', { id: userId, email });
    } catch (error) {
      console.error('Lỗi khi xác thực OTP:', error);
      Alert.alert('Lỗi', 'Xác thực OTP thất bại');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Nhập OTP được gửi đến email {email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập OTP"
        value={otp}
        keyboardType="numeric"
        onChangeText={setOtp}
        maxLength={6}
      />
      <Text>OTP hết hạn sau: {countdown} giây</Text>
      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Xác nhận OTP</Text>
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

export default OtpScreen;
