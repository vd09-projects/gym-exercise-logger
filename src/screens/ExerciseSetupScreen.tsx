// src/screens/ExerciseSetupScreen.tsx

import React, { FC, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { db } from '../services/firebaseConfig'; // Your Firestore instance
import { doc, collection, addDoc } from 'firebase/firestore';
import { useAuthUser } from '../hooks/useAuthUser'; // Hypothetical hook if you store current user

type Field = {
  label: string;
  type: string; // Could be 'number', 'text', etc.
};

interface ExerciseSetupProps {}

const ExerciseSetupScreen: FC<ExerciseSetupProps> = () => {
  const [category, setCategory] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [fields, setFields] = useState<Field[]>([]);

  // For selecting a standard template
  const standardTemplates = {
    weightlifting: [
      { label: 'Sets', type: 'number' },
      { label: 'Weight', type: 'number' },
      { label: 'Reps', type: 'number' },
    ],
    cardio: [
      { label: 'Time', type: 'number' },
      { label: 'Distance', type: 'number' },
    ],
  };

  const { user } = useAuthUser(); // hypothetical, to get userID

  const handleSelectTemplate = (templateKey: 'weightlifting' | 'cardio') => {
    setFields(standardTemplates[templateKey]);
  };

  // Add a custom field
  const handleAddCustomField = () => {
    const newField: Field = { label: 'Custom Field', type: 'text' };
    setFields(prev => [...prev, newField]);
  };

  const handleSaveExercise = async () => {
    try {
      if (!user || !user.uid) {
        Alert.alert('Error', 'No user logged in.');
        return;
      }
      if (!category || !exerciseName) {
        Alert.alert('Validation', 'Category and Exercise Name are required.');
        return;
      }

      const docRef = await addDoc(
        collection(db, 'users', user.uid, 'exercises'),
        {
          category,
          exerciseName,
          fields,
        }
      );
      Alert.alert('Success', `Exercise saved with ID: ${docRef.id}`);
      setCategory('');
      setExerciseName('');
      setFields([]);
    } catch (error) {
      Alert.alert('Error', 'Could not save exercise.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add a New Exercise</Text>

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Chest"
        value={category}
        onChangeText={setCategory}
      />

      <Text style={styles.label}>Exercise Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Bench Press"
        value={exerciseName}
        onChangeText={setExerciseName}
      />

      <View style={styles.buttonRow}>
        <Button
          title="Use Weightlifting Template"
          onPress={() => handleSelectTemplate('weightlifting')}
        />
        <Button
          title="Use Cardio Template"
          onPress={() => handleSelectTemplate('cardio')}
        />
      </View>

      <Button title="Add Custom Field" onPress={handleAddCustomField} />

      <Text style={styles.subHeading}>Current Fields:</Text>
      {fields.map((field, index) => (
        <Text key={index} style={styles.fieldListItem}>
          {field.label} ({field.type})
        </Text>
      ))}

      <Button title="Save Exercise" onPress={handleSaveExercise} />
    </View>
  );
}

export default ExerciseSetupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subHeading: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  fieldListItem: {
    fontSize: 14,
    marginBottom: 4,
  },
});