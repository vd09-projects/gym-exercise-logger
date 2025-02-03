// src/components/Footer.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FooterProps {
  activeTab: 'logger' | 'setup' | 'progress';
  onChangeTab: (tab: 'logger' | 'setup' | 'progress') => void;
}

export default function Footer({ activeTab, onChangeTab }: FooterProps) {
  const tabs = [
    { key: 'logger', label: 'Logger' },
    { key: 'setup', label: 'Setup' },
    { key: 'progress', label: 'Progress' },
  ];

  return (
    <View style={styles.footerContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, isActive && styles.activeTab]}
            onPress={() => onChangeTab(tab.key as any)}
          >
            <Text style={[styles.tabText, isActive && styles.activeText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    height: 60,
    backgroundColor: '#1A1A1A',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    padding: 10,
  },
  tabText: {
    color: '#FFF',
    fontSize: 14,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6A00',
  },
  activeText: {
    color: '#FF6A00',
    fontWeight: 'bold',
  },
});