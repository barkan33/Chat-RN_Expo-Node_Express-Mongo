import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Замените на адрес вашего сервера

const App = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userId, setUserId] = useState('000000000000000000000001'); // Хранит идентификатор пользователя

    useEffect(() => {
        // Получение идентификатора пользователя (может быть получен с сервера)
        // setUserId(Math.floor(Math.random() * 1000000)); // Заглушка для примера
        socket.emit('join', userId); // Отправка идентификатора на сервер

        // Обработка новых сообщений
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });

        // Очистка событий при размонтировании компонента
        return () => {
            socket.off('message');
            socket.emit('disconnect1'); // Отправка сигнала о отключении
        };
    }, []);

    const handleSendMessage = () => {
        socket.emit('message', {
            senderId: userId, // Отправитель сообщения
            receiverId: '000000000000000000000002',
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
                        <Text>{item.senderId}: {item.content}</Text>
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

export default App;