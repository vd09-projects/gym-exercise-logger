// src/screens/LayoutScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExerciseLogScreen from './ExerciseLogScreen';
import ExerciseSetupScreen from './ExerciseSetupScreen';
import ProgressScreen from './ProgressScreen';
import HomeScreen from './HomeScreen';

export default function LayoutScreen() {
  // This state controls which tab is active: "logger" | "setup" | "progress"
  const [activeTab, setActiveTab] = useState<'Home' | 'logger' | 'setup' | 'progress'>('Home');

  // Decide which middle content to render
  let content;
  switch (activeTab) {
    case 'logger':
      content = <ExerciseLogScreen />;
      break;
    case 'setup':
      content = <ExerciseSetupScreen />;
      break;
    case 'progress':
      content = <ProgressScreen />;
      break;
    default:
      content = <HomeScreen />;
      break;
  }

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <Header
        onPressTab={(tab) => setActiveTab(tab)}
      />

      {/* Middle content, based on active tab */}
      <View style={styles.content}>
        {content}
      </View>

      {/* Fixed Footer with 3 buttons */}
      <Footer
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    // The middle area
    padding: 16,
  },
});