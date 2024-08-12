import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { formStyles, styles } from './Styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, JWT_KEY } from "react-native-dotenv"
import { FAB } from '@rneui/themed';
import { Image } from '@rneui/base';



//Show avater
export const ChatListScreen = () => {
    const [chats, setChats] = useState([]);
    const navigation = useNavigation();
    const [userId, setUserId] = useState(null);

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
                setChats(data.chats);

            } else {
                console.error('Get chats failed:', data.message);
            }
        } catch (error) {
            console.error('Get chats error:', error);
        }
    };

    const handleSelectChat = (receiver) => {
        navigation.navigate('Chat', { receiver });
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
            <Text style={styles.title}>Chats List</Text>
            <FlatList
                data={chats}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {

                    let userDetails = item.userDetails;
                    let receiver = userDetails.filter(user => user._id !== userId)[0];
                    console.log('receiver', receiver);
                    return (
                        <TouchableOpacity onPress={() => handleSelectChat(receiver)}>
                            <View style={styles.userItem}>
                                <Image style={styles.chatItemAvatar} source={{ uri: receiver.avatarURL ? receiver.avatarURL : "https://aui.atlassian.com/aui/9.5/docs/images/avatar-person.svg" }} />
                                <Text style={styles.userName}>{receiver.username}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
            <FAB
                onPress={() => {
                    navigation.navigate('SearchUsers');
                }}
                style={{ width: "100%", margin: 20 }}
                placement="right"
                color="#007bff"
                size="large"
                visible
                overlayColor="#007bff"
                icon={{ name: "add", color: "#fff" }}
            />
        </SafeAreaView >
    );
};
