// src/screens/ExerciseLogScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, onSnapshot, addDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase/firebaseConfig';
import { useAuthUser } from '../hooks/useAuthUser';
import { COLLECTIONS } from '../constants/firestore';

interface Exercise {
  id: string;
  category: string;
  exerciseName: string;
  fields: { label: string; type: string }[];
}

interface FieldValue {
  [label: string]: string;
}

export default function ExerciseLogScreen() {
  const { user } = useAuthUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [fieldValues, setFieldValues] = useState<FieldValue>({});

  useEffect(() => {
    if (!user) return;

    const exercisesRef = collection(db, COLLECTIONS.USERS, user.uid, COLLECTIONS.EXERCISES);
    const unsubscribe = onSnapshot(exercisesRef, (snapshot) => {
      const data: Exercise[] = [];
      snapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() } as Exercise);
      });
      setExercises(data);
    });

    return () => unsubscribe();
  }, [user]);

  const categories = Array.from(new Set(exercises.map((ex) => ex.category)));
  const filteredExercises = exercises.filter((ex) => ex.category === selectedCategory);
  const selectedExercise = exercises.find((ex) => ex.id === selectedExerciseId);

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
      const exerciseDocRef = doc(db, COLLECTIONS.USERS, user.uid, COLLECTIONS.EXERCISES, selectedExercise.id);
      await addDoc(collection(exerciseDocRef, COLLECTIONS.LOGS), {
        timestamp: Timestamp.now(),
        values: { ...fieldValues },
      });

      Alert.alert('Success', 'Workout log saved!');

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
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          dropdownIconColor="#FF6A00"
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => {
            setSelectedCategory(itemValue);
            setSelectedExerciseId('');
          }}
        >
          <Picker.Item label="-- Choose a Muscles Group --" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      {selectedCategory !== '' && (
        <>
          <Text style={styles.title}>Select an Exercise</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              dropdownIconColor="#FF6A00"
              selectedValue={selectedExerciseId}
              onValueChange={(itemValue) => {
                setSelectedExerciseId(itemValue);
                setFieldValues({}); // Clear fieldValues when a different exercise is selected
              }}
            >
              <Picker.Item label="-- Choose an Exercise --" value="" />
              {filteredExercises.map((ex) => (
                <Picker.Item key={ex.id} label={ex.exerciseName} value={ex.id} />
              ))}
            </Picker>
          </View>
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
                // keyboardType={field.type === 'number' ? 'decimal-pad' : 'default'}
                keyboardType='default'
                placeholder={field.type === 'number' ? '0' : 'Enter value'}
                placeholderTextColor="#888"
                value={fieldValues[field.label] || ''}
                onChangeText={(text) => handleChangeFieldValue(field.label, text)}
              />
            </View>
          ))}
          <View style={styles.saveButtonContainer}>
            <Button title="Save Log" onPress={handleSaveLog} color="#FF6A00" />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#FF6A00',
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
    backgroundColor: '#1A1A1A',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fieldLabel: {
    width: 100,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  fieldInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FF6A00',
    borderRadius: 6,
    padding: 8,
    marginLeft: 8,
    color: '#FFFFFF',
    backgroundColor: '#1A1A1A',
  },
  saveButtonContainer: {
    marginTop: 16,
  },
});