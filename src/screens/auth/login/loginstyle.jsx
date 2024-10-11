import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    headerlogo: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerlogin: {
        flex: 2,
    },
    logo: {
        width: 100,
        height: 100,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 10,
        paddingHorizontal: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    forgot: {
        color: '#888',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#4A90E2',
        paddingVertical: 15,
        borderRadius: 10,
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
    },
    registerText: {
        color: '#4A90E2',
    },
});

export default styles;
