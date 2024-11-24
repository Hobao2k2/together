import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, useColorScheme, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { loginApi } from '../../../api/authapi';
import styles from './loginstyle';
import { colorStyles } from '../../../styles/colorScheme';

const LoginScreen = ({ navigation, setIsLoggedIn, setUserId }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const scheme = useColorScheme();
  const colors = colorStyles[scheme] || colorStyles.light;

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Vui lòng nhập email và mật khẩu',
      });
      return;
    }

    try {
      const response = await loginApi(email, password);
      const { userId, token } = response;
      if (!userId || !token) {
        throw new Error('Không tìm thấy ID người dùng hoặc token trong phản hồi');
      }

      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('userToken', token);
      setIsLoggedIn(true);
      setUserId(userId);

      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Đăng nhập thành công',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: `Đăng nhập thất bại: ${error.response?.data.message || error.message}`,
      });
    }
  };

  return (
    <LinearGradient colors={['#6fa3fe', '#d4f6ff', '#ffe3e3']} style={styles.gradientBackground}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={80} // Điều chỉnh vị trí cho phù hợp với thiết bị
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
              placeholder="Email"
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
              placeholder="Mật khẩu"
              placeholderTextColor={colors.text}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <View style={styles.row}>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={[styles.forgot, { color: colors.text }]}>Quên mật khẩu</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.buttonBackground }]}
              onPress={handleLogin}
            >
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>Đăng nhập</Text>
            </TouchableOpacity>
            <View style={styles.registerContainer}>
              <Text style={{ color: colors.text }}>Nếu bạn chưa có tài khoản hãy</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.registerText, { color: colors.linkText }]}> Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default LoginScreen;
