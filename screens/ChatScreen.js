import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Button,
    SafeAreaView,
    FlatList,
} from 'react-native';
import styles from './Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatMessage from './ChatMessage';
import { API_URL, JWT_KEY } from "react-native-dotenv"
import { useRoute } from '@react-navigation/native';



export const ChatScreen = () => {
    const route = useRoute();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatData, setChatId] = useState('');
    const [receiverId, setReceiverId] = useState(route.params.receiverId);

    const getMessages = async () => {
        try {
            console.log("chatId", chatData);

            const response = await fetch(`${API_URL}/chats/messages`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    Authorization: `Bearer ${await AsyncStorage.getItem(JWT_KEY)}`,
                },
                body: JSON.stringify({ chatId: chatData._id }),
            });

            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setMessages(data.messages);
            } else {
                console.error('Get messages failed:', data);
            }
        } catch (error) {
            console.error('Get messages error:', error);
        }
    };
    const sendMessage = async () => {
        try {
            console.log('chatData._id', chatData._id)
            console.log('newMessage', newMessage)
            const response = await fetch(`${API_URL}/chats/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await AsyncStorage.getItem(JWT_KEY)}`,
                },
                body: JSON.stringify({ chatId: chatData._id, content: newMessage }),
            });

            if (response.ok) {
                setNewMessage('');
                getMessages();
            } else {
                const data = await response.json();
                console.error('Send message failed:', data.message);
            }
        } catch (error) {
            console.error('Send message error:', error);
        }
    };
    const isChatExist = async () => {
        try {
            console.log('receiverId', receiverId)
            const response = await fetch(`${API_URL}/chats/chat/participants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await AsyncStorage.getItem(JWT_KEY)}`,
                },
                body: JSON.stringify({ receiverId }),
            });
            const data = await response.json();

            console.log("isChatExist ", data);
            if (response.ok) {
                setChatId(data.chatId);
                return true
            }
            if (response.status === 404)
                return false

            else {
                throw new Error('Check chat failed:', data);
            }
        }
        catch (error) {
            console.error('Check chat error:', error);
        }
    }
    const createChat = async () => {
        try {
            const response = await fetch(`${API_URL}/chats/newchat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await AsyncStorage.getItem(JWT_KEY)}`,
                },
                body: JSON.stringify({ receiverId }),
            });

            if (response.ok) {

                const newChatId = await response.json();
                console.log(newChatId);
                return newChatId;
            }

        } catch (error) {
            console.error('Check chat error:', error);
            return false
        }
    }

    useEffect(() => {
        console.log("chatData", chatData);
        if (chatData)
            getMessages();
    }, [chatData]);

    useEffect(() => {
        if (receiverId)
            try {
                if (!isChatExist())
                    createChat();

            } catch (error) {
                console.error(error)
            }
    }, [receiverId]);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <ChatMessage
                        message={item.content}
                        isCurrentUser={item.senderId != receiverId}
                    />
                )}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter a message"
                    onChangeText={setNewMessage}
                    value={newMessage}
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </SafeAreaView>
    );
};
