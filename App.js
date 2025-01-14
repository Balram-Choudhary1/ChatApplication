
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize the socket connection
    // const socketInstance = io('http://localhost:3001'); 
    const socketInstance = io('http://192.168.130.6:3001');
    setSocket(socketInstance);

    // Listen for incoming messages
    socketInstance.on('receive_message', (data) => {
      console.log('Received message:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  

  const handleSetUsername = () => {
    if (username.trim() && socket) {
      socket.emit('set_username', username);
      setIsConnected(true);
    } else {
      console.warn('Username cannot be empty');
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && socket?.connected) {
      socket.emit('send_message', { message });
      setMessage(''); // Clear input field
    } else {
      console.warn('Socket not connected or message is empty');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Real-time Chat App</Text>

      {!isConnected ? (
        <View style={styles.usernameInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
          />
          

          <TouchableOpacity   onPress={handleSetUsername} 
          style={styles.userbtn}>
            <Text style={styles.touchabletext}>Set Username</Text>
          </TouchableOpacity>

         
        </View>
      ) : (
        <View style={styles.chatContainer}>
          <ScrollView style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <Text style={styles.noMessages}>No messages yet...</Text>
            ) : (
              messages.map((item, index) => (
                <View key={index} style={styles.messageContainer}>
                  <Text style={styles.messageUser}>{item.user}: </Text>
                  <Text style={styles.messageText}>{item.message}</Text>
                </View>
              ))
            )}
          </ScrollView>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            value={message}
            onChangeText={setMessage}
          />

            <TouchableOpacity onPress={handleSendMessage}  
            style={styles.touchablebtn}>
            <Text 
            style = {styles.touchabletext}>Send</Text>
          </TouchableOpacity>

        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  title: { 
    fontSize: 24, textAlign: 'center', 
    marginVertical: 20 
  },
  usernameInputContainer: { 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 2,
    width: '80%',
    paddingHorizontal: 16,
    marginBottom: 10,
    alignSelf: 'center',
    borderRadius: 16,
    marginVertical: 24,
    padding:10
  
  },
  chatContainer: { 
    flex: 1, 
    padding: 10 
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
    backgroundColor: 'lightyellow',
    padding: 10,
  },
  noMessages: { 
    textAlign: 'center', 
    color: 'gray', 
    fontStyle: 'italic' 
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
    marginBottom: 5,
  },
  messageUser: { 
    fontWeight: 'bold', 
    color: 'green'
   },
  messageText: { color: 'black' },
  touchablebtn:{
    height:'6%', width:'auto',
    backgroundColor:'#f2db05',
    marginHorizontal:24,
    marginVertical:18,
    borderRadius:12,
    padding:0.1
  },
  touchabletext:{
      alignSelf:"center",paddingVertical:2, 
      color:'white', fontWeight:"bold", fontSize:16
    },
  userbtn:{
     height:36,
      width:'80%', 
       backgroundColor:'#06d482' , 
        paddingVertical:2, paddingVertical:4,borderRadius:12,marginVertical:18
      }
  
  
});

export default App;
