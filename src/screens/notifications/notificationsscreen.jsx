import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AllNotifications from './allnotifications';
import RequestsReceived from './requestsreceivednotifications/requestsreceivednotificationsscreen';
import RequestsSent from './requestssentnotifications';

const Tab = createMaterialTopTabNavigator();

const NotificationsScreen = ({ userId }) => {
  return (
    <Tab.Navigator
      initialRouteName="All" // Đặt mặc định là màn hình AllNotifications
      screenOptions={{
        tabBarStyle: { backgroundColor: '#f4f4f4' },
        tabBarIndicatorStyle: { backgroundColor: '#6200ea' },
        tabBarLabelStyle: { fontWeight: 'bold' },
      }}
    >
      <Tab.Screen name="All">
        {() => <AllNotifications userId={userId} />}
      </Tab.Screen>
      <Tab.Screen name="Received">
        {() => <RequestsReceived userId={userId} />}
      </Tab.Screen>
      <Tab.Screen name="Sent">
        {() => <RequestsSent userId={userId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default NotificationsScreen;
