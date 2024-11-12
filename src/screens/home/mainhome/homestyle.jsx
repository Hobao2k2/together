import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },

  // Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 5,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },

  // Post Container
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

  // Post Header
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
    fontSize: 16,
  },

  // Post Content
  postContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  mediaContainer: {
    height: width * 0.56, // Tỷ lệ 16:9 dựa trên chiều rộng màn hình
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },  
  mediaWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  // Post Interaction Section
  postInteractionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
  },

  // No Media Fallback
  noMediaText: {
    textAlign: 'center',
    color: '#9c9c9c',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default styles;
