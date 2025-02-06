// src/components/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthUser } from '../hooks/useAuthUser';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { COLORS } from '../constants/theme';

interface HeaderProps {
  onPressTab: (tab: 'Home' | 'record' | 'configure' | 'insights') => void;
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
      <TouchableOpacity style={[styles.tabButton]} onPress={() => onPressTab('Home')}>
        <Text style={styles.headerText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.headerText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 92,
    backgroundColor: COLORS.backgroundDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 40,
  },
  tabButton: {
    padding: 10,
  },
});