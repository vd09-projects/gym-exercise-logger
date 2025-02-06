// src/components/Footer.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

interface FooterProps {
  activeTab: 'Home' | 'record' | 'configure' | 'insights';
  onChangeTab: (tab: 'Home' | 'record' | 'configure' | 'insights') => void;
}

export default function Footer({ activeTab, onChangeTab }: FooterProps) {
  const tabs = [
    { key: 'record' as const, label: 'Record', icon: 'create-outline' as const },
    { key: 'configure' as const, label: 'Setup', icon: 'settings-outline' as const },
    { key: 'insights' as const, label: 'Progress', icon: 'bar-chart-outline' as const },
  ];

  return (
    <View style={styles.footerContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, isActive && styles.activeTab]}
            onPress={() => onChangeTab(tab.key)}
          >
            <Ionicons
              name={tab.icon}
              size={22}
              color={isActive ? COLORS.primary : COLORS.textWhite}
              style={{ marginBottom: 2 }}
            />
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
  tabButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContainer: {
    height: 60,
    backgroundColor: COLORS.footerBackground,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabText: {
    color: COLORS.textWhite,
    fontSize: SIZES.fontSmall,
    marginTop: 2,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  activeText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});