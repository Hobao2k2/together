import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, Image } from 'react-native';
import { loginApi } from '../api/authApi';  
import styles from './loginstyle';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
        const response = await loginApi(email, password); 
        Alert.alert('Đang nhập thành công', response.message);
        navigation.navigate('Home');
        } catch (error) {
        Alert.alert('Đăng nhập thất bại', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerlogo}>
            <Image
                source={require('../../../../assets/image/together.png')} // Đảm bảo đường dẫn đúng và có phần mở rộng .png
                style={styles.logo}
            />
            </View>
            <View style={styles.headerlogin}>
                <TextInput 
                    style={styles.input}
                    placeholder="Your email" 
                    value={email} 
                    onChangeText={setEmail} 
                />
                <TextInput 
                    style={styles.input}
                    placeholder="Password" 
                    value={password} 
                    onChangeText={setPassword} 
                    secureTextEntry 
                />
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgot}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
                <View style={styles.registerContainer}>
                    <Text>Don’t Have an Account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerText}> Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
};

export default LoginScreen;