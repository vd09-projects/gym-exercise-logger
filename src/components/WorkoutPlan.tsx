import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Exercise from './Exercise';
import { COLORS, STYLES } from '../constants/theme';
import { WorkoutPlan as WorkoutPlanType } from '../types/types';

interface WorkoutPlanProps {
  workout: WorkoutPlanType;
}

const WorkoutPlan: React.FC<WorkoutPlanProps> = ({ workout }) => {
  return (
    <View style={styles.container}>
      <Text style={STYLES.subHeading}>{workout.name}</Text>
      {workout.exercises.length > 0 ? (
        workout.exercises.map((exercise, index) => (
          <Exercise key={index} exercise={exercise} />
        ))
      ) : (
        <Text style={styles.noExerciseText}>No exercises added yet.</Text>
      )}
    </View>
  );
};

export default WorkoutPlan;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundDark,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  noExerciseText: {
    color: COLORS.textWhite,
    fontSize: 14,
    marginTop: 4,
  },
});