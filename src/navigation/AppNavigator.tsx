// src/navigation/AppNavigator.tsx (simplified)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthUser } from '../hooks/useAuthUser';
import AuthNavigator from './AuthNavigator';
import LayoutScreen from '../screens/LayoutScreen'; // new

export default function AppNavigator() {
  const { user } = useAuthUser();

  return (
    <NavigationContainer>
      {user ? (
        // If user is logged in, show the new Layout with tabs
        <LayoutScreen />
      ) : (
        // Otherwise show sign-in / sign-up flow
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}