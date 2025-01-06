import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    marginTop: 20,
    fontWeight: 'bold',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginVertical: 8,
    borderRadius: 10, // Bo góc các mục
    borderWidth: 1, // Viền để làm nổi khối
    shadowColor: '#000', // Bóng đổ (shadow)
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1, // Độ mờ của bóng
    shadowRadius: 4, // Độ lan của bóng
    elevation: 3, // Độ nổi (chỉ áp dụng trên Android)
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // Avatar tròn
    marginRight: 12,
  },
  chatDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    fontSize: 14,
    marginTop: 4,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
});

export default styles;
