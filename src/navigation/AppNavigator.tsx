// src/navigation/AppNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthUser } from '../hooks/useAuthUser';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

export default function AppNavigator() {
    const { user } = useAuthUser();

    return (
        <NavigationContainer>
            {/* If user is authenticated, show the Main flow; otherwise, show the Auth flow */}
            {user ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}