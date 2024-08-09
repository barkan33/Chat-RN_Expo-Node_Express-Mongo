import React, { useState } from 'react';
import {
    Text,
    TextInput,
    Button,
    SafeAreaView,
} from 'react-native';
import styles from './Styles';
import { useNavigation } from '@react-navigation/native';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, JWT_KEY } from "react-native-dotenv"




export const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigation = useNavigation();

    const handleRegister = async () => {
        try {
            const response = await fetch(`${API_URL}/users/registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, username }),
            });

            if (response.ok) {
                console.log('Registration successful');
                navigation.navigate('Login');
            } else {
                const data = await response.json();
                console.error('Registration failed:', data.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Regestration</Text>
            <TextInput
                style={styles.input}
                keyboardType='email-address'
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                autoCapitalize='none'
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={setUsername}
                value={username}
                autoCapitalize='none'
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
                autoCapitalize='none'
            />
            <Button title="Regestration" onPress={handleRegister} />
        </SafeAreaView>
    );
};
