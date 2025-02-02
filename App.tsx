// App.tsx
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { LogBox } from 'react-native';

// Ignore non-critical warnings (if needed)
LogBox.ignoreLogs(['Setting a timer']); 

export default function App() {
  return <AppNavigator />;
}