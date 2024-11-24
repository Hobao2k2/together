import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
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
        marginVertical: 10,
    },
    button: {
        paddingVertical: 15,
        borderRadius: 10,
        marginVertical: 10,
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
    },
    registerText: {
    },
});

export default styles;
