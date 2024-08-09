import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Button,
} from 'react-native';
import styles from './Styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, JWT_KEY } from "react-native-dotenv"




export const ChatListScreen = () => {
    const [chats, setChats] = useState([]);
    const navigation = useNavigation();

    const getChats = async () => {
        try {
            const response = await fetch(`${API_URL}/chats/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await AsyncStorage.getItem(JWT_KEY)}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                setChats(data.chats);
            } else {
                const data = await response.json();
                console.error('Get chats failed:', data.message);
            }
        } catch (error) {
            console.error('Get chats error:', error);
        }
    };

    const handleSelectChat = (chatId) => {
        navigation.navigate('Chat', { chatId });
    };

    useEffect(() => {
        getChats();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Button title="Add User" onPress={() => {
                navigation.navigate('SearchUsers')
            }} />
            <Text style={styles.title}>Chats List</Text>
            <FlatList
                data={chats}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelectChat(item._id.toString())}>
                        <View style={styles.chatItem}>
                            <Text style={styles.chatTitle}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};
