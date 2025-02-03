import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainNavigator';
import { useAuthUser } from '../hooks/useAuthUser';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase/firebaseConfig';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuthUser();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      // handle error
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hey, {user?.email || 'Guest'}!</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Go to Exercise Setup"
          onPress={() => navigation.navigate('ExerciseSetup')}
          color="#FF6A00"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Go to Exercise Logger"
          onPress={() => navigation.navigate('ExerciseLog')}
          color="#FF6A00"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Go to Exercise Progress"
          onPress={() => navigation.navigate('Progress')}
          color="#FF6A00"
        />
      </View>

      {user && (
        <View style={styles.buttonContainer}>
          <Button
            title="Log Out"
            onPress={handleLogout}
            color="#FF6A00"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212',
    padding: 16, 
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 8,
  },
});