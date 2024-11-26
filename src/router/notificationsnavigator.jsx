import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AllNotifications from '../screens/notifications/allnotifications'; 
import RequestsSentNotifications from '../screens/notifications/requestssentnotifications'; 
import RequestsReceivedNotifications from '../screens/notifications/requestsreceivednotifications/requestsreceivednotificationsscreen'; 
import NotificationDetailScreen from '../screens/notifications/notificationdetailscreen'; 

const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

const NotificationTabNavigator = () => {
    return (
      <TopTab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: '#f8f8f8' }, // Màu nền của thanh tab
          tabBarIndicatorStyle: { backgroundColor: '#007aff', height: 3 }, // Đường kẻ dưới tab
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold', textTransform: 'none' }, // Kiểu chữ của tab
          tabBarActiveTintColor: '#007aff', // Màu chữ khi tab được chọn
          tabBarInactiveTintColor: '#777', // Màu chữ khi tab không được chọn
        }}
      >
        <TopTab.Screen name="All" component={AllNotifications} options={{ title: 'Tất cả' }} />
        <TopTab.Screen
          name="Sent"
          component={RequestsSentNotifications}
          options={{ title: 'Đã gửi' }}
        />
        <TopTab.Screen
          name="Received"
          component={RequestsReceivedNotifications}
          options={{ title: 'Đã nhận' }}
        />
      </TopTab.Navigator>
    );
  };
  
  // Stack Navigator: Kết hợp Top Tab Navigator và màn hình Notification Details
  const NotificationsNavigator = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="NotificationTabs"
          component={NotificationTabNavigator}
          options={{ headerShown: false }} // Ẩn header mặc định của stack
        />
        <Stack.Screen
          name="NotificationDetails"
          component={NotificationDetailScreen}
          options={{ title: 'Chi tiết thông báo' }} // Tùy chỉnh tiêu đề màn hình chi tiết
        />
      </Stack.Navigator>
    );
  };  

export default NotificationsNavigator;
