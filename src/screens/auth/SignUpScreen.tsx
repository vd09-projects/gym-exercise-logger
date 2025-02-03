// src/screens/auth/SignUpScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created!');
    } catch (error: any) {
      Alert.alert('Sign Up Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create an Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={{ marginTop: 16 }}>
        <Button title="Sign Up" onPress={handleSignUp} color="#FF6A00" />
      </View>

      <Text style={styles.switchText}>Already have an account?</Text>
      <Button
        title="Go to Sign In"
        onPress={() => navigation.navigate('SignIn')}
        color="#FF6A00"
      />
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
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#FFFFFF',
    marginBottom: 16 
  },
  input: {
    borderWidth: 1,
    borderColor: '#FF6A00',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    color: '#FFFFFF',
    backgroundColor: '#1A1A1A',
  },
  switchText: {
    marginVertical: 8,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});