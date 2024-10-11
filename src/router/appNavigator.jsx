import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/mainhome/homescreen';
import AddPostScreen from '../screens/home/addpost/addpostscreen';
import LoginScreen from '../screens/auth/login/loginscreen';
import RegisterScreen from '../screens/auth/register/registerscreen';
import ForgotPasswordScreen from '../screens/auth/forgotpassword/forgotpasswordscreen';
import OtpScreen from '../screens/auth/forgotpassword/otpscreen';
import ResetPasswordScreen from '../screens/auth/forgotpassword/resetpasswordscreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator cho các màn hình chính sau khi đăng nhập
function HomeTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AddPost" component={AddPostScreen} />
    </Tab.Navigator>
  );
}

// Stack Navigator cho các màn hình đăng nhập và đăng ký
function AuthStackNavigator({ setIsLoggedIn }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  

  return (
    <>
      {isLoggedIn ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeTabs" component={HomeTabNavigator} />
          <Stack.Screen name="AddPost" component={AddPostScreen} />
        </Stack.Navigator>
      ) : (
        <AuthStackNavigator setIsLoggedIn={setIsLoggedIn} />  
      )}
    </>
  );
}

// function AppNavigator() {
//   return (
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         {/* Màn hình Home được đặt là màn hình mặc định */}
//         <Stack.Screen name="HomeTabs" component={HomeTabNavigator} />
//       </Stack.Navigator>
//   );
// }

export default AppNavigator;