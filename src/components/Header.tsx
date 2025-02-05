// src/components/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// If you need the user or signOut, import them from hooks & Firebase
import { useAuthUser } from '../hooks/useAuthUser';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

interface HeaderProps {
  onPressTab: (tab: 'Home' | 'logger' | 'setup' | 'progress') => void;
}

export default function Header({ onPressTab }: HeaderProps) {
  const { user } = useAuthUser();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      // handle error
    }
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity 

style={[styles.tabButton]}
      onPress={() => onPressTab('Home')}>
        <Text style={styles.headerText}>Home</Text>
      </TouchableOpacity>

      {/* <Text style={styles.headerTitle}>
        {user ? `Welcome, ${user.email}` : 'Gym Logger'}
      </Text> */}

      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.headerText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 92,
    backgroundColor: '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerText: {
    color: '#FF6A00',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 40,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 40,
  },
  tabButton: {
    padding: 10,
  },
});