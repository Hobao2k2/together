import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/router/appNavigator';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
