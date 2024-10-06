import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Nội dung của màn hình Home */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Home Content Here</Text>
      </View>

      {/* Thanh TabBar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.iconContainer}>
          <Icon name="search-outline" size={30} color="#748c94" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Icon name="home-outline" size={30} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add-outline" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Icon name="person-outline" size={30} color="#748c94" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Icon name="heart-outline" size={30} color="#748c94" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    height: 80,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4A90E2',
    position: 'relative',
    top: -25, 
  },
});
