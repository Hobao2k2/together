import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ced4da',
  },
  backButton: {
    marginRight: 10,
  },
  receiverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  callButton: {
    marginLeft: 'auto', 
    paddingHorizontal: 20,      
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical:15,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '75%',
    padding: 12,
    borderRadius: 15,
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1e7dd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  theirMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#f8d7da',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    color: '#495057',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    color: '#6c757d',
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  sendButton: {
    marginLeft: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 40,
    backgroundColor: '#007bff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default styles;
