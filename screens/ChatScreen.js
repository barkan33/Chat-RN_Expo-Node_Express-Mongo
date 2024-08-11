import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    Button,
    SafeAreaView,
    FlatList,
    Text,
} from 'react-native';
import {styles} from './Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatMessage from './ChatMessage';
import { API_URL, JWT_KEY } from "react-native-dotenv"
import { useRoute } from '@react-navigation/native';



export const ChatScreen = () => {
    const route = useRoute();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatData, setChatId] = useState('');
    const [receiver, setReceiver] = useState(route.params.receiver);

    const getMessages = async () => {
        try {
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
            const response = await fetch(`${API_URL}/chats/chat/participants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await AsyncStorage.getItem(JWT_KEY)}`,
                },
                body: JSON.stringify({ receiverId: receiver._id }),
            });
            const data = await response.json();
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
                body: JSON.stringify({ receiverId: receiver._id }),
            });

            if (response.ok) {

                const newChatId = await response.json();
                return newChatId;
            }

        } catch (error) {
            console.error('Check chat error:', error);
            return false
        }
    }

    useEffect(() => {
        console.log("receiver", receiver);
        if (chatData)
            getMessages();
    }, [chatData]);

    useEffect(() => {
        if (receiver._id)
            try {
                if (!isChatExist())
                    createChat();

            } catch (error) {
                console.error(error)
            }
    }, [receiver]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{receiver.username}</Text>
            </View>
            <FlatList
                data={messages}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <ChatMessage
                        message={item.content}
                        isCurrentUser={item.senderId != receiver._id}
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
