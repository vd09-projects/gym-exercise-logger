// src/components/ScrollableScreen.tsx

import React, { ReactNode } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

interface ScrollableScreenProps {
  children: ReactNode;
}

const ScrollableScreen: React.FC<ScrollableScreenProps> = ({ children }) => {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.innerContainer}>{children}</View>
    </ScrollView>
  );
};

export default ScrollableScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#121212', // Consistent background
  },
  contentContainer: {
    paddingBottom: 20, // Prevents elements from being cut off
  },
  innerContainer: {
    flex: 1,
    padding: 16, // Standard padding for screens
  },
});