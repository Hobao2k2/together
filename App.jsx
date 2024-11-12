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
      style={{ borderLeftColor: 'green' }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
      }}
      text2Style={{
        fontSize: 14,
        color: '#333',
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
      }}
      text2Style={{
        fontSize: 14,
        color: '#333',
      }}
    />
  ),
};

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
      {/* Thêm Toast với cấu hình tùy chỉnh */}
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}
