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
    const [userId, setUserId] = useState(null);
    console.log("ChatListScreen");

    const getChats = async () => {
        try {
            const response = await fetch(`${API_URL}/chats/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await AsyncStorage.getItem(JWT_KEY)}`,
                }
            });

            const data = await response.json();
            if (response.ok) {
                console.log('data', data)
                setChats(data.chats);

            } else {
                console.error('Get chats failed:', data.message);
            }
        } catch (error) {
            console.error('Get chats error:', error);
        }
    };

    const handleSelectChat = (receiverId) => {
        navigation.navigate('Chat', { receiverId });
    };

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await AsyncStorage.getItem("USER_ID");
            if (id) {
                setUserId(id);
            }
        }
        fetchUserId();
        getChats();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Button title="Add User" onPress={() => {
                navigation.navigate('SearchUsers');
            }} />
            <Text style={styles.title}>Chats List</Text>
            <FlatList
                data={chats}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {

                    let userDetails = item.userDetails;
                    let receiver = userDetails.filter(user => user._id !== userId)[0];
                    console.log('receiver', receiver);
                    return (
                        <TouchableOpacity onPress={() => handleSelectChat(receiver._id)}>
                            <View style={styles.chatItem}>
                                <Text style={styles.chatTitle}>{receiver.username}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </SafeAreaView >
    );
};
