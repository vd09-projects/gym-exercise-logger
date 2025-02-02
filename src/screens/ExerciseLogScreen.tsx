// src/screens/ExerciseLogScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, query, where, onSnapshot, addDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuthUser } from '../hooks/useAuthUser';

interface Exercise {
  id: string;              // Firestore doc ID
  category: string;
  exerciseName: string;
  fields: { label: string; type: string }[];
}

interface FieldValue {
  [label: string]: string; // e.g., { Sets: '3', Weight: '100', Reps: '8' }
}

export default function ExerciseLogScreen() {
  const { user } = useAuthUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [fieldValues, setFieldValues] = useState<FieldValue>({});

  // Fetch exercises from Firestore when the component mounts
  useEffect(() => {
    if (!user) return;

    const exercisesRef = collection(db, 'users', user.uid, 'exercises');
    const unsubscribe = onSnapshot(exercisesRef, (snapshot) => {
      const data: Exercise[] = [];
      snapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() } as Exercise);
      });
      setExercises(data);
    });

    return () => unsubscribe();
  }, [user]);

  // Get unique categories from the exercises
  const categories = Array.from(new Set(exercises.map((ex) => ex.category)));

  // Filter exercises by selected category
  const filteredExercises = exercises.filter((ex) => ex.category === selectedCategory);

  // Find the selected exercise doc
  const selectedExercise = exercises.find((ex) => ex.id === selectedExerciseId);

  // Update field value in state
  const handleChangeFieldValue = (fieldLabel: string, newValue: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldLabel]: newValue }));
  };

  const handleSaveLog = async () => {
    if (!user) {
      Alert.alert('Error', 'No user logged in.');
      return;
    }
    if (!selectedExercise) {
      Alert.alert('Error', 'No exercise selected.');
      return;
    }

    try {
      const exerciseDocRef = doc(db, 'users', user.uid, 'exercises', selectedExercise.id);
      await addDoc(collection(exerciseDocRef, 'logs'), {
        timestamp: Timestamp.now(), // or store as a Firebase Timestamp
        values: { ...fieldValues },
      });

      Alert.alert('Success', 'Workout log saved!');

      // Reset the form
      setSelectedCategory('');
      setSelectedExerciseId('');
      setFieldValues({});
    } catch (error) {
      Alert.alert('Error', 'Could not save log.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Category</Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => {
          setSelectedCategory(itemValue);
          setSelectedExerciseId(''); // reset if switching category
        }}
      >
        <Picker.Item label="-- Choose a Category --" value="" />
        {categories.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>

      {selectedCategory !== '' && (
        <>
          <Text style={styles.title}>Select an Exercise</Text>
          <Picker
            selectedValue={selectedExerciseId}
            onValueChange={(itemValue) => setSelectedExerciseId(itemValue)}
          >
            <Picker.Item label="-- Choose an Exercise --" value="" />
            {filteredExercises.map((ex) => (
              <Picker.Item
                key={ex.id}
                label={ex.exerciseName}
                value={ex.id}
              />
            ))}
          </Picker>
        </>
      )}

      {selectedExercise && (
        <>
          <Text style={styles.title}>Log Details for {selectedExercise.exerciseName}</Text>
          {selectedExercise.fields.map((field) => (
            <View key={field.label} style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <TextInput
                style={styles.fieldInput}
                keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                value={fieldValues[field.label] || ''}
                onChangeText={(text) => handleChangeFieldValue(field.label, text)}
              />
            </View>
          ))}

          <Button title="Save Log" onPress={handleSaveLog} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fieldLabel: {
    width: 100,
    fontWeight: '600',
  },
  fieldInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginLeft: 8,
  },
});