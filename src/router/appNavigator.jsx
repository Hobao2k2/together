import React, { useState, forwardRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/home/mainhome/homescreen';
import AddPostScreen from '../screens/post/addpost/addpostscreen';
import ProfileScreen from '../screens/profile/profilescreen';  
import PostDetailScreen from '../screens/post/postdetail/postdetailscreen';  
import EditPostScreen from '../screens/post/editpost/editpostscreen';
import LoginScreen from '../screens/auth/login/loginscreen';
import RegisterScreen from '../screens/auth/register/registerscreen';
import ForgotPasswordScreen from '../screens/auth/forgotpassword/forgotpasswordscreen';
import OtpScreen from '../screens/auth/forgotpassword/otpscreen';
import ResetPasswordScreen from '../screens/auth/forgotpassword/resetpasswordscreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator for Profile and Post Detail
function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileStack" component={ProfileScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="EditPost" component={EditPostScreen} />
    </Stack.Navigator>
  );
}

// Stack Navigator for Home and Post Detail
function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeStack" component={HomeScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
    </Stack.Navigator>
  );
}

// Custom Floating Action Button Component with forwardRef
const AddPostButton = forwardRef(({ color }, ref) => (
  <Icon
    name="add"
    size={50}
    color={color}
    style={{
      position: 'absolute',
      bottom: 6,
      alignSelf: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 36,
      padding: 6,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
    }}
    ref={ref}
  />
));

// Tab Navigator for the main authenticated screens
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
        tabBarStyle: {
          height: 60,
          paddingTop: 10,
          paddingBottom: 8,
          borderTopWidth: 3,
          borderTopColor: '#e0e0e0',
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Search" component={HomeStackNavigator} />
      <Tab.Screen
        name="AddPost"
        component={AddPostScreen}
        options={{
          tabBarIcon: ({ color }) => <AddPostButton color={color} />,
        }}
      />
      <Tab.Screen name="Notifications" component={ProfileStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

// Stack Navigator for Authentication screens
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

function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage authentication state
  const [userId, setUserId] = useState(null); // Store userId after successful login

  return (
    <>
      {isLoggedIn ? (
        // Main tab navigator when logged in
        <MainTabNavigator />
      ) : (
        // Authentication screens when not logged in
        <AuthStackNavigator
          setIsLoggedIn={setIsLoggedIn} // Pass setIsLoggedIn to AuthStackNavigator
          setUserId={setUserId} // Pass setUserId to AuthStackNavigator
        />
      )}
    </>
  );
}

export default AppNavigator;
