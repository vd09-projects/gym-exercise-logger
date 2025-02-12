// src/constants/theme.ts
import { StyleSheet } from 'react-native';

export const COLORS = {
    primary: '#FF6A00',
    background: '#121212',
    backgroundDark: '#1A1A1A',
    textWhite: '#FFFFFF',
    textGray: '#888',
    borderColor: '#FF6A00',
    dividerColor: '#333',
    footerBackground: '#1A1A1A',
    placeholderTextColor: '#888',
  };
  
  export const SIZES = {
    fontSmall: 12,
    fontMedium: 14,
    fontLarge: 16,
    fontXL: 18,
    fontXXL: 22,
    fontXXXL: 28,
  };
  
  export const FONTS = {
    // If you want to centralize font families / weights
    // regular: { fontFamily: 'System', fontWeight: '400' },
    // bold: { fontFamily: 'System', fontWeight: '700' },
    // etc.
  };

  export const STYLES = StyleSheet.create({
    heading: {
      fontSize: 26,
      fontWeight: 'bold',
      color: COLORS.textWhite,
      marginBottom: 24,
      textAlign: 'center',
      borderBottomWidth: 3,
      borderBottomColor: COLORS.primary,
      paddingBottom: 4,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.textWhite,
      marginBottom: 8,
    },
    subHeading: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.textWhite,
      marginBottom: 8,
    },
  });