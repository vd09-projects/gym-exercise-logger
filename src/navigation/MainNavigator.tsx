// src/navigation/MainNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ExerciseSetupScreen from '../screens/ExerciseSetupScreen';
import ExerciseLogScreen from '../screens/ExerciseLogScreen';
import ProgressScreen from '../screens/ProgressScreen';

export type MainStackParamList = {
  Home: undefined;
  ExerciseSetup: undefined;
  ExerciseLog: undefined;
  Progress: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="ExerciseSetup"
        component={ExerciseSetupScreen}
        options={{ title: 'Exercise Setup' }}
      />
      <Stack.Screen
        name="ExerciseLog"
        component={ExerciseLogScreen}
        // Hide the default header so we can show our own
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ title: 'Workout Progress' }}
      />
    </Stack.Navigator>
  );
}
