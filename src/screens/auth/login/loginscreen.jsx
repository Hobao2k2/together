import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, Image } from 'react-native';
import { loginApi } from '../../../api/authapi';  
import styles from './loginstyle';

const LoginScreen = ({ navigation, setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleLogin = async () => {
        if (!email || !password) {
          return Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
        }
      
        try {
          const response = await loginApi(email, password);
          // Nếu đăng nhập thành công, cập nhật trạng thái đăng nhập
          Alert.alert('Thành công', 'Đăng nhập thành công');
          setIsLoggedIn(true);  // Cập nhật trạng thái đăng nhập để chuyển sang màn hình chính
        //   navigation.navigate('Home');  // Điều hướng đến màn hình chính sau khi đăng nhập
        } catch (error) {
          console.log('Lỗi đăng nhập:', error);  // Log lỗi chi tiết ra console
          if (error.response) {
            console.log('Chi tiết lỗi từ server:', error.response.data);  // Log chi tiết lỗi từ phản hồi server
            Alert.alert('Lỗi', `Đăng nhập thất bại: ${error.response.data.message || 'Lỗi không xác định từ server'}`);
          } else {
            Alert.alert('Lỗi', `Đăng nhập thất bại: ${error.message || 'Không thể kết nối đến server'}`);
          }
        }
    };      
  
    return (
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
                    placeholder="Email" 
                    value={email} 
                    onChangeText={setEmail} 
                />
                <TextInput 
                    style={styles.input}
                    placeholder="Mật khẩu" 
                    value={password} 
                    onChangeText={setPassword} 
                    secureTextEntry 
                />
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={styles.forgot}>Quên mật khẩu</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Đăng nhập</Text>
                </TouchableOpacity>
                <View style={styles.registerContainer}>
                    <Text>Nếu bạn chưa có tài khoản hãy</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.registerText}> Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
  
export default LoginScreen;
