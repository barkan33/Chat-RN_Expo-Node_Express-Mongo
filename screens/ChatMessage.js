import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ChatMessage = ({ message, isCurrentUser }) => {
    return (
        <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
            <Text style={styles.messageText}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    messageContainer: {
        padding: 10,
        marginBottom: 5,
        borderRadius: 10,
        maxWidth: '80%',
    },
    currentUserMessage: {
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-end',
    },
    otherUserMessage: {
        backgroundColor: '#E0FFFF',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
    },
});

export default ChatMessage;