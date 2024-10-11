import React, { useState } from 'react';
import { View, TextInput, ScrollView, Text, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';  
import { registerApi } from '../../../api/authapi';  
import styles from './registerstyle';  

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState(null);  // Ngày tháng năm sinh
  const [showDatePicker, setShowDatePicker] = useState(false);  // Trạng thái hiển thị DateTimePicker

  const handleRegister = async () => {
    if (!username || !email || !password || !dob || !confirmPassword) {
      return Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Lỗi', 'Mật khẩu không khớp');
    }

    try {
      const formattedDob = dob.toISOString().split('T')[0];  // Định dạng ngày sinh (YYYY-MM-DD)
      const response = await registerApi(username, email, password, formattedDob);
      Alert.alert('Thành công', 'Đăng ký thành công');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Lỗi', 'Đăng ký thất bại');
    }
  };

  // Hiển thị hoặc ẩn cửa sổ chọn ngày
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  // Xử lý khi người dùng chọn ngày
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === 'ios');  // Ẩn lịch trên Android sau khi chọn
    setDob(currentDate);  // Cập nhật ngày tháng năm sinh
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}  // Sử dụng 'padding' cho iOS và 'height' cho Android
      style={styles.container}
      keyboardVerticalOffset={80}  // Điều chỉnh vị trí của keyboard trên Android (điều chỉnh cho phù hợp)
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.headerlogo}>
            <Image
              source={require('../../../../assets/image/together.png')}
              style={styles.logo}
            />
          </View>

          <View style={styles.headerlogin}>
            <TextInput
              style={styles.input}
              placeholder="Tên đăng nhập"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              secureTextEntry
              onChangeText={setConfirmPassword}
            />

            {/* Thêm phần chọn ngày tháng năm sinh */}
            <TouchableOpacity onPress={showDatePickerModal} style={styles.dateInput}>
              <Text style={styles.dateText}>
                {dob ? dob.toLocaleDateString() : 'Ngày sinh'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dob || new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}  // Giới hạn ngày không vượt quá hiện tại
              />
            )}

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text>Đã có tài khoản?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.registerText}> Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
