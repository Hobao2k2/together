import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 50,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    marginVertical: 10,
  },
  video: {
    width: width - 40,
    height: 300,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
  },
  image: {
    width: width - 40,
    height: 300,
    borderRadius: 10,
    alignSelf: 'center',
  },
  mediaWrapper: {
    position: 'relative',
  },
  indexLabel: {
    position: 'absolute',
    top: 20,
    right: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 'bold',
    zIndex: 1,
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  interaction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentsContainer: {
    marginTop: 20,
    marginLeft: 30,
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: 'bold',
  },
  childComment: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 40,
    marginTop: 5,
  },
});

export default styles;
