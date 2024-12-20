import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Import các màn hình
import AllMessagesScreen from './screens/AllMessagesScreen';
import UserMessagesScreen from './screens/UserMessagesScreen';
import GroupMessagesScreen from './screens/GroupMessagesScreen';
import VideoCallScreen from './screens/VideoCallScreen';

// Tạo Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const MessageNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'All') {
            iconName = 'chatbubbles-outline';
          } else if (route.name === 'User') {
            iconName = 'person-outline';
          } else if (route.name === 'Group') {
            iconName = 'people-outline';
          } else if (route.name === 'VideoCall') {
            iconName = 'videocam-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="All"
        component={AllMessagesScreen}
        options={{ title: 'All Chats' }}
      />
      <Tab.Screen
        name="User"
        component={UserMessagesScreen}
        options={{ title: 'User Messages' }}
      />
      <Tab.Screen
        name="Group"
        component={GroupMessagesScreen}
        options={{ title: 'Group Chats' }}
      />
      <Tab.Screen
        name="VideoCall"
        component={VideoCallScreen}
        options={{
          title: 'Video Call',
          tabBarButton: () => null, // Ẩn tab Video Call khỏi TabBar
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

export default MessageNavigator;
