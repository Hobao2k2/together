import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { mockMessages } from './mockMessages';

const tabs = ['All', 'User', 'Group'];

const ListChatScreen = () => {
  const [activeTab, setActiveTab] = useState('All');

  // Lọc tin nhắn theo tab
  const filteredMessages = mockMessages.filter((item) => {
    if (activeTab === 'All') return true;
    return item.type === activeTab.toLowerCase();
  });

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity style={styles.messageContainer} activeOpacity={0.7}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
        {item.unread && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unread}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Recent Chats</Text>
        <View style={styles.searchIcon}>
          <Text>🔍</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Message List */}
      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessageItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchIcon: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: '#E5E5E5',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#E5E5E5',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: '#AAA',
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  unreadCount: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ListChatScreen;
