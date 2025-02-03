// src/screens/ExerciseSetupScreen.tsx

import React, { FC, useState } from 'react';
import {
  View, Text, TextInput, Button, Alert, StyleSheet, Modal, TouchableOpacity
} from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuthUser } from '../hooks/useAuthUser';
import TemplateModal from '../components/TemplateModal';

type Field = {
  label: string;
  type: string; // 'number' | 'text' etc.
};

interface ExerciseSetupProps {}

const ExerciseSetupScreen: FC<ExerciseSetupProps> = () => {
  const { user } = useAuthUser();
  const [category, setCategory] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectTemplate = (templateFields: Field[]) => {
    // Combine or overwrite the fields array
    setFields(templateFields);
    setModalVisible(false);
  };

  const handleAddCustomField = () => {
    const newField: Field = { label: 'Custom Field', type: 'text' };
    setFields((prev) => [...prev, newField]);
  };

  const handleSaveExercise = async () => {
    if (!user || !user.uid) {
      Alert.alert('Error', 'No user logged in.');
      return;
    }
    if (!category.trim() || !exerciseName.trim()) {
      Alert.alert('Validation', 'Category and Exercise Name are required.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'exercises'), {
        category,
        exerciseName,
        fields,
      });
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

      {/* Category Input */}
      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Chest"
        placeholderTextColor="#888"
        value={category}
        onChangeText={setCategory}
      />

      {/* Exercise Name Input */}
      <Text style={styles.label}>Exercise Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Bench Press"
        placeholderTextColor="#888"
        value={exerciseName}
        onChangeText={setExerciseName}
      />

      {/* CHOOSE STANDARD TEMPLATE Button */}
      <View style={{ marginVertical: 8 }}>
        <Button
          title="Choose Standard Template"
          onPress={() => setModalVisible(true)}
          color="#FF6A00"
        />
      </View>

      {/* Add Custom Field */}
      <View style={{ marginVertical: 8 }}>
        <Button
          title="Add Custom Field"
          onPress={handleAddCustomField}
          color="#FF6A00"
        />
      </View>

      {/* Current Fields */}
      <Text style={styles.subHeading}>Current Fields:</Text>
      {fields.map((field, index) => (
        <Text key={index} style={styles.fieldListItem}>
          {field.label} ({field.type})
        </Text>
      ))}

      {/* Save Exercise */}
      <View style={{ marginTop: 16 }}>
        <Button title="Save Exercise" onPress={handleSaveExercise} color="#FF6A00" />
      </View>

      {/* Template Modal */}
      <TemplateModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </View>
  );
};

export default ExerciseSetupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FF6A00',
    borderRadius: 6,
    padding: 8,
    color: '#FFF',
    backgroundColor: '#1A1A1A',
    marginBottom: 8,
  },
  subHeading: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  fieldListItem: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 4,
  },
});