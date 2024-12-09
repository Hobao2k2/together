import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    gradientBackground: {
      flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      },
      item: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
      },
      avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: '#ddd',
      },
      info: {
        flex: 1,
      },
      username: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      email: {
        fontSize: 14,
        color: '#666',
      },
      buttons: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      acceptButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginRight: 5,
      },
      rejectButton: {
        backgroundColor: '#F44336',
        padding: 10,
        borderRadius: 5,
      },
      buttonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
      },
      emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
      },
});

export default styles;