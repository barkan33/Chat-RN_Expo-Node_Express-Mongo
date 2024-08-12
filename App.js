import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { ChatListScreen } from './screens/ChatListScreen';
import { SearchUsersScreen } from './screens/SearchUsersScreen';
import { ChatScreen } from './screens/ChatScreen';


import { initializeApp } from "firebase/app";
import { getApps } from 'firebase/app';
import { FIREBASE_CONFIG } from "react-native-dotenv"

const firebaseConfig = FIREBASE_CONFIG;

if (getApps().length === 0) {
    initializeApp(firebaseConfig);
}

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
                <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
                <Stack.Screen options={{ headerShown: false }} name="ChatList" component={ChatListScreen} />
                <Stack.Screen name="SearchUsers" component={SearchUsersScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};



export default App;