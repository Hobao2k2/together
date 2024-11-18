import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, Image } from 'react-native';
import { loginApi } from '../../../api/authapi';  
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage
import styles from './loginstyle';

const LoginScreen = ({ navigation, setIsLoggedIn, setUserId }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
        }
      
        try {
            // Gọi API đăng nhập
            const response = await loginApi(email, password);
        
            // Kiểm tra và log lại phản hồi để đảm bảo đúng
            console.log('Phản hồi từ API đăng nhập:', response);
        
            // Lấy userId và token từ response
            const { userId, token } = response;  // Lấy userId và token từ phản hồi
        
            if (!userId || !token) {
                throw new Error('Không tìm thấy ID người dùng hoặc token trong phản hồi');
            }
        
            Alert.alert('Thành công', 'Đăng nhập thành công');
            
            // Lưu userId và token vào AsyncStorage để duy trì phiên làm việc
            await AsyncStorage.setItem('userId', userId);
            await AsyncStorage.setItem('userToken', token);
        
            // Cập nhật trạng thái đăng nhập và lưu userId vào state
            setIsLoggedIn(true);
            setUserId(userId); // Lưu userId vào state của ứng dụng
        
        } catch (error) {
            console.log('Lỗi đăng nhập:', error);
      
            if (error.response) {
                console.log('Chi tiết lỗi từ server:', error.response.data);
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
