import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getFriendRequestsReceived, getFriendRequestsSent } from '../../api/notifications';

const AllNotifications = ({ userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const received = await getFriendRequestsReceived(userId);
        const sent = await getFriendRequestsSent(userId);
        setData([...received, ...sent]);
      } catch (error) {
        console.error('Error fetching all notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ea" />;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.username || 'Unknown User'}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default AllNotifications;
