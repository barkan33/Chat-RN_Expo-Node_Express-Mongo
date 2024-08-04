import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Замените на адрес вашего сервера

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });

        return () => {
            socket.off('message');
        };
    }, [messages]);

    const handleSendMessage = () => {
        socket.emit('message', {
            sender: 'User', // Замените на имя пользователя
            receiver: 'Server', // Замените на получателя
            content: newMessage,
        });
        setNewMessage('');
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.message}>
                        <Text>{item.sender}: {item.content}</Text>
                    </View>
                )}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Введите сообщение"
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <Button title="Отправить" onPress={handleSendMessage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    message: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginRight: 10,
    },
});

export default ChatScreen;