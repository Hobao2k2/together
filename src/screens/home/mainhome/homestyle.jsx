import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 24,
    color: '#333',
  },
  tabBarContainer: {
    flexDirection: 'row',
    height: 56,
    width: width,
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#ddd',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tabButton: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 10,
    color: '#777',
    marginTop: 4,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
  },
  fabButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#007aff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default styles;