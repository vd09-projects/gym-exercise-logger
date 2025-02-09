import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { Exercise as ExerciseType } from '../types/types';

interface ExerciseProps {
  exercise: ExerciseType;
}

const Exercise: React.FC<ExerciseProps> = ({ exercise }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
      {exercise.fields.map((field, index) => (
        <Text key={index} style={styles.fieldText}>
          {field.label}: {field.type}
        </Text>
      ))}
    </View>
  );
};

export default Exercise;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textWhite,
  },
  fieldText: {
    fontSize: 14,
    color: COLORS.textWhite,
  },
});