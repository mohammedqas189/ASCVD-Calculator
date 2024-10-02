import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Voice from '@react-native-community/voice'; // Updated import

const ChatPage = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false); // Track if the mic is on

  // Initialize Voice recognition
  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners); // Cleanup
    };
  }, []);

  // Handle speech results
  const onSpeechResults = (result) => {
    if (result.value && result.value.length > 0) {
      setCurrentMessage(result.value[0]); // Update currentMessage with the recognized text
    }
  };

  // Handle errors
  const onSpeechError = (error) => {
    console.error('Voice Input Error:', error);
    Alert.alert('Error', 'An error occurred while recognizing voice.');
  };

  // Start recording voice
  const handleVoiceInput = async () => {
    try {
      setIsListening(true);
      await Voice.start('en-US'); // Start listening for voice input
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      Alert.alert('Error', 'Could not start voice recognition.');
    }
  };

  // Stop recording voice
  const stopVoiceInput = async () => {
    try {
      setIsListening(false);
      await Voice.stop(); // Stop listening for voice input
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  // Function to send the message and clear the input
  const sendMessage = () => {
    if (currentMessage.trim() !== '') {
      setMessages([...messages, { text: currentMessage, sender: 'user' }]);
      setCurrentMessage('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Icon to navigate to the calculator */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back to Calculator</Text>
      </TouchableOpacity>

      <ScrollView style={styles.messageList}>
        {messages.map((message, index) => (
          <View key={index} style={styles.messageContainer}>
            <Text style={styles.message}>{message.sender === 'user' ? 'You: ' : 'Bot: '}{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message or record your voice"
          value={currentMessage}
          onChangeText={setCurrentMessage}
        />
        {/* Microphone Icon for voice input */}
        <TouchableOpacity onPress={isListening ? stopVoiceInput : handleVoiceInput}>
          <Ionicons name={isListening ? "mic-off" : "mic"} size={24} color="black" style={styles.micIcon} />
        </TouchableOpacity>
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
    padding: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    fontSize: 18,
    marginLeft: 5,
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    marginVertical: 5,
  },
  message: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 5,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  micIcon: {
    marginRight: 10,
  },
});

export default ChatPage;
