import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Image, Keyboard, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchSearchResults } from '../../api/searchapi';
import styles from './searchstyle';

const SearchScreen = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load lịch sử tìm kiếm từ AsyncStorage
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem('searchHistory');
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Lỗi khi tải lịch sử tìm kiếm:', error);
      }
    };

    loadSearchHistory();
  }, []);

  // Lưu lịch sử tìm kiếm vào AsyncStorage
  const saveSearchHistory = async (newKeyword) => {
    try {
      const updatedHistory = [newKeyword, ...history.filter((item) => item !== newKeyword)];
      if (updatedHistory.length > 5) {
        updatedHistory.pop();
      }
      setHistory(updatedHistory);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Lỗi khi lưu lịch sử tìm kiếm:', error);
    }
  };

  // Gọi API khi tìm kiếm
  const handleSearch = async () => {
    if (keyword.trim() === '') {
      alert('Vui lòng nhập từ khóa!');
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    try {
      saveSearchHistory(keyword);
      const data = await fetchSearchResults(keyword, 0);
      setResults(data);
    } catch (error) {
      if (error.message === 'Token is missing. Please log in again.') {
        Alert.alert('Authentication Error', 'Token is missing. Please log in again.');
      } else {
        Alert.alert('Error', 'Error searching people. Please try again later.');
      }
      console.error('Error searching people:', error);
    } finally {
      setLoading(false);
    }
  };

  // Khi nhấn từ khóa trong lịch sử
  const handleHistoryClick = (historyKeyword) => {
    setKeyword(historyKeyword);
    handleSearch();
  };

  const renderResultItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Image
        source={{ uri: item.avatar || 'https://via.placeholder.com/150' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleHistoryClick(item)}>
      <Text style={styles.historyItem}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm người dùng..."
        value={keyword}
        onChangeText={setKeyword}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Tìm kiếm</Text>
      </TouchableOpacity>

      {history.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Lịch sử tìm kiếm:</Text>
          <FlatList
            data={history}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderHistoryItem}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {loading ? (
        <Text style={styles.loadingText}>Đang tải...</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderResultItem}
          ListEmptyComponent={<Text style={styles.noResultsText}>Không có kết quả phù hợp.</Text>}
        />
      )}
    </View>
  );
};

export default SearchScreen;