import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    Button,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL, JWT_KEY } from "react-native-dotenv"
import styles from './Styles';

export const LoginScreen = () => {
    const [email, setEmail] = useState('aaa@aaa.com');
    const [password, setPassword] = useState('aaaaaa');
    const navigation = useNavigation();

    const handleLogin = async () => {

        try {

            const response = await fetch(`${API_URL}/users/login`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                if (JWT_KEY) {
                    await AsyncStorage.setItem(JWT_KEY, token);
                    navigation.navigate('ChatList');
                } else {
                    console.error('JWT_KEY is undefined');
                }
            } else {
                const data = await response.json();
                console.error('Login failed:', data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Regestration" onPress={() => {
                navigation.navigate('Register');
            }} />
        </SafeAreaView>
    );
};
