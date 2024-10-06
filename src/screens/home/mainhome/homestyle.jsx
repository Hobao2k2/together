import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    postContainer: {
      padding: 15,
      marginVertical: 10,
      borderRadius: 10,
      backgroundColor: '#f8f9fa',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 1,
      elevation: 3,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    content: {
      fontSize: 14,
      color: '#333',
      marginBottom: 10,
    },
    image: {
      width: 100,
      height: 100,
      marginRight: 10,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    addButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: 'tomato',
      borderRadius: 50,
      padding: 15,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
});

export default styles;