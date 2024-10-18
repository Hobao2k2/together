import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  wallpaperContainer: {
    width: width * 0.9,
    height: width * 0.5,
    marginTop: width * 0.08,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  wallpaperOverlay: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  wallpaper: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  wallpaperIcon: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 50,
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
  menuIcon: {
    marginLeft: 'auto',
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
  },
  username: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  bio: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginVertical: 10,
  },
  updateProfileButton: {
    marginTop: 20,
    backgroundColor: '#4c669f',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  updateProfileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#4CAF50', 
    padding: 10,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', 
    width: '60%', 
  },
  cancelButton: {
    backgroundColor: 'red', 
  },
  buttonText: {
    color: 'white', 
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', 
  },
});

export default styles;
