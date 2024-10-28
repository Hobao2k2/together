import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  contentContainer: {
    marginBottom: 10,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
  },
  postImage: {
    width: 300,
    height: 200,
    marginRight: 10,
    borderRadius: 8,
  },
  postVideo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  noMediaText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 10,
  },
  interactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  interactionText: {
    marginHorizontal: 5,
    fontSize: 16,
    color: '#333',
  },
  commentsSection: {
    marginTop: 10,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentContainer: {
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
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
  },
  commentUsername: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  noCommentsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});

export default styles;
