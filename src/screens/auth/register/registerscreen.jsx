import React, { useState } from 'react';
import { View, TextInput, ScrollView, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { registerApi } from '../../../api/authapi';
import styles from './registerstyle';
import { colorStyles } from '../../../styles/colorScheme';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const scheme = useColorScheme();
  const colors = colorStyles[scheme] || colorStyles.light;

  const handleRegister = async () => {
    if (!username || !email || !password || !dob || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Vui lòng điền đầy đủ thông tin',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Mật khẩu không khớp',
      });
      return;
    }

    try {
      const formattedDob = dob.toISOString().split('T')[0];
      await registerApi(username, email, password, formattedDob);
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Đăng ký thành công',
      });
      navigation.navigate('Login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Đăng ký thất bại',
      });
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === 'ios');
    setDob(currentDate);
  };

  return (
    <LinearGradient colors={['#6fa3fe', '#d4f6ff', '#ffe3e3']} style={styles.gradientBackground}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={80}
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
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    color: colors.text,
                  },
                ]}
                placeholder="Tên đăng nhập"
                placeholderTextColor={colors.text}
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    color: colors.text,
                  },
                ]}
                placeholder="Nhập email"
                placeholderTextColor={colors.text}
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    color: colors.text,
                  },
                ]}
                placeholder="Nhập mật khẩu"
                placeholderTextColor={colors.text}
                value={password}
                secureTextEntry
                onChangeText={setPassword}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    color: colors.text,
                  },
                ]}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor={colors.text}
                value={confirmPassword}
                secureTextEntry
                onChangeText={setConfirmPassword}
              />

              <TouchableOpacity onPress={showDatePickerModal} style={styles.dateInput}>
                <Text style={{ color: colors.text }}>
                  {dob ? dob.toLocaleDateString() : 'Ngày sinh'}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={dob || new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: colors.buttonBackground },
                ]}
                onPress={handleRegister}
              >
                <Text style={{ color: colors.buttonText }}>Đăng ký</Text>
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={{ color: colors.text }}>Đã có tài khoản?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={[styles.registerText, { color: colors.linkText }]}> Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </LinearGradient>
  );
};

export default RegisterScreen;
