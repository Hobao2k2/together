import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#6200ea',
    },
    errorText: {
      color: '#f00',
      fontSize: 16,
      textAlign: 'center',
      marginHorizontal: 20,
    },
    emptyText: {
      color: '#888',
      fontSize: 16,
      textAlign: 'center',
    },
    item: {
      padding: 15,
      marginVertical: 5,
      marginHorizontal: 10,
      backgroundColor: 'white',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
    },
    text: {
      fontSize: 16,
      color: '#333',
    },
    boldText: {
      fontWeight: 'bold',
      color: '#000',
    },
  });  

export default styles;
