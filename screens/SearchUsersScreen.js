import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { styles } from './Styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, JWT_KEY } from "react-native-dotenv"
import { Image } from '@rneui/base';




export const SearchUsersScreen = () => {
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]);
    const navigation = useNavigation();

    const handleSearch = async () => {
        try {
            const response = await fetch(`${API_URL}/users/search/${encodeURIComponent(username)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${await AsyncStorage.getItem(JWT_KEY)}`,
                },
            });

            if (response.ok) {
                const data = await response.json();

                setUsers(data.users);
            } else {
                const data = await response.json();
                console.error('Search failed:', data.message);
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const handleSelectUser = (receiver) => {
        navigation.navigate('Chat', { receiver });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Users List</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter a username name"
                onChangeText={setUsername}
                value={username}
            />
            <Button title="Search" onPress={handleSearch} />
            <FlatList
                data={users}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleSelectUser(item)}
                    >
                        <View style={styles.userItem}>
                            <Image style={styles.chatItemAvatar} source={{ uri: item.avatarURL ? item.avatarURL : "https://aui.atlassian.com/aui/9.5/docs/images/avatar-person.svg" }} />
                            <Text style={styles.userName}>{item.username}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};
