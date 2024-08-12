import React, { useEffect, useState } from 'react';
import {
    Text,
    TextInput,
    Button,
    SafeAreaView,
    View,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, JWT_KEY } from "react-native-dotenv"
import { styles, formStyles } from './Styles';
import * as ImagePicker from 'expo-image-picker';
import { Image } from '@rneui/base';
import * as Crypto from 'expo-crypto';

import { getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


export const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showError, setshowError] = useState('');
    const [avatarUri, setAvatarUri] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploading, setUploading] = useState(false);
    const navigation = useNavigation();

    const handleRegister = async () => {
        setUploading(true);
        if (password !== confirmPassword) {
            setshowError('Passwords do not match');
            return;
        }
        else {
            setshowError('');
        }
        try {
            let encryptedPassword = await encryptPass(password)
            const response = await fetch(`${API_URL}/users/registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password: encryptedPassword, username }),
            });

            const data = await response.json();
            if (response.ok) {
                setshowError('');
                const token = data.token;
                const userId = data.insertedId;

                if (JWT_KEY) {
                    await AsyncStorage.setItem(JWT_KEY, token);
                    await AsyncStorage.setItem("USER_ID", userId);
                    if (avatarUri) {
                        await uploadImage(avatarUri, userId);
                    }
                    navigation.navigate('ChatList');
                } else {
                    console.error('JWT_KEY is undefined');
                }
            } else {
                setshowError(data.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setUploading(false);
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
    const uploadImage = async (uri, userId) => {
        setUploadingAvatar(true);
        try {
            const storage = getStorage(getApp(), "gs://fir-demo-8cec0.appspot.com");
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    console.log(e);
                    reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", uri, true);
                xhr.send(null);
            });

            const imageRef = ref(storage, `user-avatars/${userId}`);
            await uploadBytes(imageRef, blob);

            const downloadURL = await getDownloadURL(imageRef);
            const response = await fetch(`${API_URL}/users/avatar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await AsyncStorage.getItem(JWT_KEY)}`,
                },
                body: JSON.stringify({ avatarURL: downloadURL }),
            });
            if (!response.ok) {
                const data = await response.json();

                console.log('response', data.message)
            }
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploadingAvatar(false);
        }
    };
    const encryptPass = async (pass) => {
        const digest = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256, pass);
        return digest;
    }
    return (
        <SafeAreaView style={formStyles.container}>
            <View style={formStyles.formContainer}>
                <Text style={styles.title}>Registration</Text>
                {uploadingAvatar ? (<ActivityIndicator size="large" color="#007bff" />) : (avatarUri && (
                    <View style={formStyles.avatarContainer}>
                        <Image source={{ uri: avatarUri }} style={formStyles.avatar} />
                    </View>
                ))}


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

                <TouchableOpacity disabled={email.length == 0} onPress={pickImage} style={formStyles.chooseAvatarButton}>
                    <Text style={formStyles.chooseAvatarText}>Choose Avatar</Text>
                </TouchableOpacity>

                {uploading ? (<ActivityIndicator size="large" color="#007bff" />) : (<Button disabled={uploading} title="Register" onPress={handleRegister} style={formStyles.loginButton} />)}

                <Text style={formStyles.registerText}>Already have an account? <Text style={formStyles.registerLink} onPress={() => navigation.navigate('Login')}>Sign In</Text></Text>

                <Text style={[formStyles.registerText, { color: 'red', display: showError, }]}>{showError}</Text>

            </View>
        </SafeAreaView>
    );
};
