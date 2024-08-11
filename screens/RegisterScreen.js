import React, { useEffect, useState } from 'react';
import {
    Text,
    TextInput,
    Button,
    SafeAreaView,
    View,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, JWT_KEY } from "react-native-dotenv"
import { styles, formStyles } from './Styles';
import * as ImagePicker from 'expo-image-picker';
import { Image } from '@rneui/base';



export const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showError, setshowError] = useState('');
    const [avatarUri, setAvatarUri] = useState(null);
    const navigation = useNavigation();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setshowError('Passwords do not match');
            return;
        }
        else {
            setshowError('');
        }
        try {
            const response = await fetch(`${API_URL}/users/registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, username, avatarUri }),
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
            console.error('Registration error:', error);
        }
    };
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [3, 4],
                quality: 1,
            });

            if (!result.canceled) {
                setAvatarUri(result.assets[0].uri);
            }
        }
    };


    return (
        <SafeAreaView style={formStyles.container}>
            <View style={formStyles.formContainer}>
                <Text style={styles.title}>Registration</Text>

                {avatarUri && (
                    <View style={formStyles.avatarContainer}>
                        <Image source={{ uri: avatarUri }} style={formStyles.avatar} />
                    </View>
                )}

                <View style={formStyles.inputContainer}>
                    <TextInput
                        style={formStyles.input}
                        keyboardType='email-address'
                        placeholder="Email"
                        onChangeText={setEmail}
                        value={email}
                        autoCapitalize='none'
                    />
                </View>

                <View style={formStyles.inputContainer}>
                    <TextInput
                        style={formStyles.input}
                        placeholder="Username"
                        onChangeText={setUsername}
                        value={username}
                        autoCapitalize='none'
                    />
                </View>

                <View style={formStyles.inputContainer}>
                    <TextInput
                        style={formStyles.input}
                        placeholder="Password"
                        secureTextEntry
                        onChangeText={setPassword}
                        value={password}
                        autoCapitalize='none'
                    />
                </View>

                <View style={formStyles.inputContainer}>
                    <TextInput
                        style={formStyles.input}
                        placeholder="Confirm Password"
                        secureTextEntry
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                        autoCapitalize='none'
                    />
                </View>

                <TouchableOpacity onPress={pickImage} style={formStyles.chooseAvatarButton}>
                    <Text style={formStyles.chooseAvatarText}>Choose Avatar</Text>
                </TouchableOpacity>

                <Button title="Register" onPress={handleRegister} style={formStyles.loginButton} />
                <Text style={formStyles.registerText}>Already have an account? <Text style={formStyles.registerLink} onPress={() => navigation.navigate('Login')}>Sign In</Text></Text>

                <Text style={[formStyles.registerText, { color: 'red', display: showError, }]}>{showError}</Text>

            </View>
        </SafeAreaView>
    );
};
