import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    Button,
    SafeAreaView,
    View,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, JWT_KEY } from "react-native-dotenv";
import { styles, formStyles } from './Styles';



export const LoginScreen = () => {
    const [email, setEmail] = useState('aaa@aaa.com');
    const [password, setPassword] = useState('aaaaaa');
    const [showError, setshowError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setshowError('');
                const token = data.token;
                const userId = data.userId;

                if (JWT_KEY) {
                    await AsyncStorage.setItem(JWT_KEY, token);
                    await AsyncStorage.setItem("USER_ID", userId);
                    navigation.navigate('ChatList');
                } else {
                    console.error('JWT_KEY is undefined');
                }
            } else {
                setshowError(data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
        finally {
            setIsLoading(false);
        }
    };


    return (
        <SafeAreaView style={formStyles.container}>
            <View style={formStyles.formContainer}>
                <Text style={styles.title}>Login</Text>

                <View style={formStyles.inputContainer}>
                    <TextInput
                        style={formStyles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={formStyles.inputContainer}>
                    <TextInput
                        style={formStyles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
                </View>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#007bff" />
                ) : (
                    <Button title="Login" onPress={handleLogin} style={formStyles.loginButton} />
                )}
                <Text style={formStyles.registerText}>Don't have an account? <Text style={formStyles.registerLink} onPress={() => navigation.navigate('Register')}>Sign Up</Text></Text>
                <Text style={[formStyles.registerText, { color: 'red' }]}>{showError}</Text>
            </View>
        </SafeAreaView >
    );
};

