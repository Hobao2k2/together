import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/router/appNavigator';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

// Tùy chỉnh giao diện Toast
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'green',
        backgroundColor: '#e6ffe6', // Nền nhạt cho success
        borderRadius: 8,
        marginHorizontal: 10,
        elevation: 5, // Bóng trên Android
        shadowColor: '#000', // Bóng trên iOS
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2d6a4f',
      }}
      text2Style={{
        fontSize: 14,
        color: '#2d6a4f',
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: 'red',
        backgroundColor: '#ffe6e6', // Nền nhạt cho error
        borderRadius: 8,
        marginHorizontal: 10,
        elevation: 5, // Bóng trên Android
        shadowColor: '#000', // Bóng trên iOS
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#d00000',
      }}
      text2Style={{
        fontSize: 14,
        color: '#d00000',
      }}
    />
  ),
};

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
      {/* Cấu hình Toast với thời gian hiển thị 3 giây */}
      <Toast config={toastConfig} duration={3000} />
    </NavigationContainer>
  );
}
