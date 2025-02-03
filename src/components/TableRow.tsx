// src/components/TableRow.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TableRowProps {
  exerciseName: string;
  timestamp: string;
  values: { [key: string]: string };
}

export default function TableRow({ exerciseName, timestamp, values }: TableRowProps) {
  // Flatten fields for display
  const fieldsText = Object.entries(values)
    .map(([key, val]) => `${key}: ${val}`)
    .join(', ');

  return (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 2 }]}>{exerciseName}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{timestamp}</Text>
      <Text style={[styles.cell, { flex: 3 }]}>{fieldsText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  cell: {
    color: '#FFF',
    paddingHorizontal: 4,
  },
});