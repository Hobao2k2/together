import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
  useColorScheme,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchSearchResults } from '../../api/searchapi';
import { getUserCredentials } from '../../api/profileapi';
import Toast from 'react-native-toast-message';
import styles from './searchstyle';
import { colorStyles } from '../../styles/colorScheme';

const SearchScreen = ({ navigation }) => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const scheme = useColorScheme(); // Lấy chế độ sáng/tối
  const colors = colorStyles[scheme] || colorStyles.light; // Áp dụng màu sắc

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
      Toast.show({
        type: 'info',
        text1: 'Thông báo',
        text2: 'Vui lòng nhập từ khóa!',
      });
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      saveSearchHistory(keyword);
      const data = await fetchSearchResults(keyword, 0);

      if (Array.isArray(data.result)) {
        setResults(data.result);
      } else {
        setResults([]);
        Toast.show({
          type: 'info',
          text1: 'Thông báo',
          text2: 'Không có kết quả phù hợp.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể tìm kiếm người dùng. Vui lòng thử lại sau.',
      });
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

  // Hàm chuyển sang màn hình Profile
  const handleNavigateToProfile = async (targetUserId) => {
    if (!targetUserId) {
      console.error('Không tìm thấy userId để chuyển đến trang cá nhân.');
      Alert.alert('Lỗi', 'Không thể chuyển đến trang cá nhân do thiếu thông tin người dùng.');
      return;
    }
  
    try {
      // Lấy userId đang đăng nhập từ AsyncStorage
      const { userId } = await getUserCredentials();
  
      console.log('Navigating to Profile. TargetUserId:', targetUserId, 'CurrentUserId:', userId);
  
      if (targetUserId === userId) {
        // Nếu targetUserId trùng với userId hiện tại, chuyển đến màn hình Profile
        navigation.navigate('Profile', {
          userId: targetUserId,
        });
      } else {
        // Nếu không, chuyển đến màn hình ProfileOtherUserScreen
        navigation.navigate('ProfileOtherUser', {
          userId: targetUserId,
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      Alert.alert('Lỗi', 'Không thể thực hiện điều hướng do lỗi dữ liệu.');
    }
  };

  // Render từng kết quả tìm kiếm
  const renderResultItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.resultItem, { backgroundColor: colors.card }]}
      onPress={() => handleNavigateToProfile(item.id)} 
    >
      <Image
        source={
          item.avatar_path
            ? { uri: item.avatar_path }
            : require('../../../assets/image/avatar_icon.png') // Ảnh mặc định nếu `avatar_path` là null
        }
        style={styles.avatar}
      />
      <Text style={[styles.name, { color: colors.text }]}>
        {item.username || 'Người dùng chưa đặt tên'}
      </Text>
    </TouchableOpacity>
  );

  // Render từng từ khóa trong lịch sử tìm kiếm
  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleHistoryClick(item)}>
      <Text style={[styles.historyItem, { color: colors.text }]}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#6fa3fe', '#d4f6ff', '#ffe3e3']} style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <TextInput
          style={[
            styles.searchInput,
            {
              borderColor: colors.border,
              backgroundColor: colors.inputBackground,
              color: colors.text,
            },
          ]}
          placeholder="Tìm kiếm người dùng..."
          placeholderTextColor={colors.placeholder}
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.buttonBackground }]}
          onPress={handleSearch}
        >
          <Text style={[styles.searchButtonText, { color: colors.buttonText }]}>Tìm kiếm</Text>
        </TouchableOpacity>

        {history.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={[styles.historyTitle, { color: colors.text }]}>Lịch sử tìm kiếm:</Text>
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
          <Text style={[styles.loadingText, { color: colors.text }]}>Đang tải...</Text>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderResultItem}
            ListEmptyComponent={
              <Text style={[styles.noResultsText, { color: colors.text }]}>
                Không có kết quả phù hợp.
              </Text>
            }
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default SearchScreen;
