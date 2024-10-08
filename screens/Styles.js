import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 20
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    userItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    userName: {
        fontSize: 22,
    },
    chatItemAvatar: {
        width: 60,
        height: 60,
        aspectRatio: 1,
        resizeMode: 'contain',
        borderRadius: 50,
    },
    addButtonContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    chatheader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        gap: 15,
        padding: 10,
        marginBottom: 10,
        tintColor: '#000000',
        elevation: 2,
        borderRadius: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000'
    },
    sendButton: {
        backgroundColor: '#007bff', // Or your preferred color
        borderRadius: 25, // Make the button round
        padding: 13,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export const formStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 45,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        maxWidth: 400,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        marginBottom: 15,
    },
    registerText: {
        marginTop: 10,
        fontSize: 16,
        textAlign: 'center',
    },
    registerLink: {
        color: '#007bff',
    },
    inputContainer: {
        marginBottom: 15,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    chooseAvatarButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        marginBottom: 15,
    },
    chooseAvatarText: {
        color: '#000',
        textAlign: 'center',
    },
});