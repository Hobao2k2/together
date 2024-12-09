import React, { useState, useEffect, forwardRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/home/mainhome/homescreen';
import SearchScreen from '../screens/search/searchscreen';
import AddPostScreen from '../screens/post/addpost/addpostscreen';
import NotificationsNavigator from './notificationsnavigator';
import ProfileScreen from '../screens/profile/profile_loggedin/profilescreen';
import ProfileOtherUserScreen from '../screens/profile/profile_other/profileotheruserscreen';
import PostDetailScreen from '../screens/post/postdetail/postdetailscreen';
import EditPostScreen from '../screens/post/editpost/editpostscreen';
import ChatUserScreen from '../screens/messages/chats/chatusersreen';
import LoginScreen from '../screens/auth/login/loginscreen';
import RegisterScreen from '../screens/auth/register/registerscreen';
import ForgotPasswordScreen from '../screens/auth/forgotpassword/forgotpasswordscreen';
import OtpScreen from '../screens/auth/forgotpassword/otpscreen';
import ResetPasswordScreen from '../screens/auth/forgotpassword/resetpasswordscreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator cho Profile
function ProfileStackNavigator({ setIsLoggedIn }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile">
        {props => <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen name="ProfileOtherUser" component={ProfileOtherUserScreen} />
      <Stack.Screen name="ChatUser" component={ChatUserScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="EditPost" component={EditPostScreen} />
    </Stack.Navigator>
  );
}

// Stack Navigator cho Home
function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="ProfileOtherUser" component={ProfileOtherUserScreen} />
    </Stack.Navigator>
  );
}

// Stack Navigator cho Search
function SearchStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="ProfileOtherUser" component={ProfileOtherUserScreen} />
      <Stack.Screen name="ChatUser" component={ChatUserScreen} />
    </Stack.Navigator>
  );
}

// Custom Add Post Button
const AddPostButton = forwardRef(({ color }, ref) => (
  <Icon
    name="add"
    size={60} // Kích thước biểu tượng
    color={color}
    style={{
      position: 'absolute',
      padding: 6,
      bottom: 6, // Điều chỉnh khoảng cách so với tab bar
      alignSelf: 'center', // Căn giữa theo chiều ngang
      backgroundColor: '#ffffff', // Màu nền của nút
      width: 72, // Kích thước vuông
      height: 72,
      borderRadius: 36, // Hình tròn
      elevation: 6, // Đổ bóng trên Android
      shadowColor: '#000', // Đổ bóng trên iOS
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
    }}
    ref={ref}
  />
));

// Tab Navigator chính
function MainTabNavigator({ setIsLoggedIn }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          display: route.name === 'Home' && route?.state?.routes[route.state.index]?.name === 'PostDetail' ? 'none' : 'flex', // Ẩn TabBar khi ở PostDetail
          height: 60,
          paddingTop: 10,
          paddingBottom: 6,
          borderTopWidth: 2,
          borderTopColor: '#e0e0e0',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Notifications') {
            iconName = 'notifications';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007aff',
        tabBarInactiveTintColor: '#777',
        tabBarLabelStyle: { fontSize: 10 },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={({ route }) => ({
          tabBarStyle: {
            display: route.state?.routes[route.state.index]?.name === 'PostDetail' ? 'none' : 'flex', // Ẩn TabBar khi ở PostDetail
          },
        })}
      />
      <Tab.Screen name="Search" component={SearchStackNavigator} />
      <Tab.Screen
        name="AddPost"
        component={AddPostScreen}
        options={{
          tabBarIcon: ({ color }) => <AddPostButton color={color} />,
        }}
      />
      <Tab.Screen name="Notifications" component={NotificationsNavigator} />
      <Tab.Screen
        name="Profile"
        options={({ route }) => ({
          tabBarStyle: {
            display: route.state?.routes[route.state.index]?.name === 'PostDetail' ? 'none' : 'flex', // Ẩn TabBar khi ở PostDetail
          },
        })}
      >
        {props => <ProfileStackNavigator {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Stack Navigator cho Authentication
function AuthStackNavigator({ setIsLoggedIn, setUserId }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {props => (
          <LoginScreen
            {...props}
            setIsLoggedIn={setIsLoggedIn}
            setUserId={setUserId}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

// App Navigator chính
function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  if (loading) {
    return null; // Hoặc hiển thị màn hình chờ (SplashScreen)
  }

  return isLoggedIn ? (
    <MainTabNavigator setIsLoggedIn={setIsLoggedIn} />
  ) : (
    <AuthStackNavigator setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />
  );
}

export default AppNavigator;