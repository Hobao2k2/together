import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const postSize = width - 20;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  menu: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    padding: 10,
    zIndex: 10,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  menuOptionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  wallpaperContainer: {
    width: width * 0.9,
    height: width * 0.5,
    marginTop: width * 0.08,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignSelf: 'center', 
  },
  wallpaper: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  backIcon: {
    marginRight: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatarWrapper: {
    position: 'absolute',
    top: width * 0.35,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 50,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 80,
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: width * 0.9,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignSelf: 'center',
  },
  username: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3c3c3c',
    textAlign: 'center',
  },
  bio: {
    fontSize: 16,
    color: '#6c6c6c',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postItemContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    width: width * 0.9,
    alignSelf: 'center',
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  usernamePost: {
    fontWeight: 'bold',
    color: '#333',
  },
  // Nội dung bài viết
  postContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },

  // Swiper và media
  mediaWrapper: {
    width: width * 0.9,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  postVideo: {
    width: '100%',
    height: '100%',
  },

  // Các nút tương tác
  postInteractionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  interactionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
  },
  noMediaText: {
    textAlign: 'center',
    color: '#9c9c9c',
    fontSize: 14,
    marginBottom: 10,
  }, 
  interactionButton: {
    flexDirection: 'row',
  }, 
});

export default styles;