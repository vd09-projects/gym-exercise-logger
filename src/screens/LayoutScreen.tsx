// src/screens/LayoutScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExerciseLogScreen from './ExerciseLogScreen';
import ExerciseSetupScreen from './ExerciseSetupScreen';
import ProgressScreen from './ProgressScreen';
import HomeScreen from './HomeScreen';
import AnimatedScreen from '../components/AnimatedText';
import { COLORS } from '../constants/theme';
import WorkoutPlansScreen from './WorkoutPlansScreen';

export default function LayoutScreen() {
  // Map old names to new keys: "Home" | "record" | "configure" | "insights"
  const [activeTab, setActiveTab] = useState<'Home' | 'record' | 'configure' | 'insights'>('Home');

  // State to track if keyboard is open
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Decide which middle content to render
  let content;
  switch (activeTab) {
    case 'record':
      content = <ExerciseLogScreen />;
      break;
    case 'configure':
      content = <ExerciseSetupScreen />;
      // content = <WorkoutPlansScreen />;
      break;
    case 'insights':
      content = <ProgressScreen />;
      break;
    default:
      content = <HomeScreen />;
      break;
  }

  return (
    <View style={styles.container}>
      <Header onPressTab={(tab) => setActiveTab(tab as any)} />

      {/* 🔥 Force remounting AnimatedScreen using `key={activeTab}` */}
      <View style={styles.content}>
        <AnimatedScreen key={activeTab} animationType="fade">
          {content}
        </AnimatedScreen>
      </View>

      {/* Hide the footer if keyboard is open */}
      {!isKeyboardVisible && (
        <Footer
          activeTab={activeTab}
          onChangeTab={(tab) => setActiveTab(tab)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    // The middle area
    padding: 16,
  },
});