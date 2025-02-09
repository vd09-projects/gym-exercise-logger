import React, { useEffect, useState } from 'react';
import {
  View, Text, Button, FlatList, StyleSheet, Alert
} from 'react-native';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuthUser } from '../hooks/useAuthUser';
import WorkoutPlan from '../components/WorkoutPlan';
import { COLORS, STYLES } from '../constants/theme';
import { WorkoutPlan as WorkoutPlanType } from '../types/types';

const WorkoutPlansScreen = () => {
  const { user } = useAuthUser();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlanType[]>([]);

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  const fetchWorkoutPlans = async () => {
    if (!user || !user.uid) return;

    try {
      const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'workoutPlans'));
    //   const plans = querySnapshot.docs.map(doc => ({
    //     id: doc.id,
    //     ...doc.data()
    //   })) as WorkoutPlanType[];
      const plans = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WorkoutPlanType[];
      setWorkoutPlans(plans);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const handleAddWorkout = async () => {
    if (!user || !user.uid) {
      Alert.alert('Error', 'No user logged in.');
      return;
    }
  
    try {
      const newWorkout: Omit<WorkoutPlanType, 'id'> = { 
        name: `Workout ${workoutPlans.length + 1}`, 
        exercises: [] 
      };
  
      const docRef = await addDoc(collection(db, 'users', user.uid, 'workoutPlans'), newWorkout);
  
      setWorkoutPlans([...workoutPlans, { ...newWorkout, id: docRef.id }]);
  
      Alert.alert('Success', 'New workout added.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not add workout.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={STYLES.heading}>Workout Plans</Text>
      <Button title="Add Workout" onPress={handleAddWorkout} color={COLORS.primary} />

      <FlatList
        data={workoutPlans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <WorkoutPlan workout={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default WorkoutPlansScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
});