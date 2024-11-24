import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationDetailScreen = ({ route }) => {
  const { notification } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Details</Text>
      <Text>{notification.username || 'Unknown User'}</Text>
      <Text>{notification.message || 'No additional details'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default NotificationDetailScreen;
