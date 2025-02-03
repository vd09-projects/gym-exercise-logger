// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase/firebaseConfig';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Please Log In</Text>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="test@example.com"
        placeholderTextColor="#888"
        keyboardType="email-address"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="******"
        placeholderTextColor="#888"
        secureTextEntry
      />
      <View style={{ marginTop: 16 }}>
        <Button title="Sign In" onPress={handleLogin} color="#FF6A00" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212',
    justifyContent: 'center', 
    padding: 16 
  },
  heading: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#FFFFFF',
    marginBottom: 12 
  },
  label: {
    color: '#FFFFFF',
    marginTop: 8,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FF6A00',
    borderRadius: 6,
    padding: 8,
    marginVertical: 8,
    color: '#FFFFFF',
    backgroundColor: '#1A1A1A',
  },
});