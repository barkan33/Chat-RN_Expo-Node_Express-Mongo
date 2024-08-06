import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState('66b24b58641053fe837c6c14');
  const [userId, setUserId] = useState('66b24be0d67ad9a566ad4956');

  useEffect(() => {
    // Загрузка чата и сообщений
    fetchChat();
  }, []);

  const fetchChat = async () => {
    try {
      // Замените 'YOUR_CHAT_ID' на фактический ID чата
      const response = await fetch('https://chat-backend-ke6y.onrender.com/chat_system/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId: '66b24b58641053fe837c6c14' }),
      });
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  };

  const sendMessage = async () => {
    try {
        console.log("chatID:", chatId);
        console.log("userId:", userId);
        console.log("newMessage:", newMessage);
        
      const response = await fetch('https://chat-backend-ke6y.onrender.com/chat_system/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: chatId,
          senderId: userId,
          content: newMessage,
        }),
      });
      if (response.ok) {
        // Обновление списка сообщений
        fetchChat();
        setNewMessage('');
      } else {
        console.error('Error sending message:', response.status);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id.toString()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Введите сообщение"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Button title="Отправить" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
});

export default ChatScreen;