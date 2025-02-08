// src/screens/ExerciseSetupScreen.tsx

import React, { FC, useState } from 'react';
import {
  View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity
} from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuthUser } from '../hooks/useAuthUser';
import TemplateModal from '../components/TemplateModal';
import { Ionicons } from '@expo/vector-icons';
import ScrollableScreen from '../components/ScrollableScreen';
import { COLORS, STYLES } from '../constants/theme';

type Field = {
  label?: string;
  type: string;
  placeholder?: string;
};

interface ExerciseSetupProps { }

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

  const handleRenameField = (index: number, newLabel: string) => {
    setFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = { ...updatedFields[index], label: newLabel };
      return updatedFields;
    });
  };

  const handleRemoveField = (index: number) => {
    setFields((prevFields) => prevFields.filter((_, i) => i !== index));
  };

  const handleAddCustomField = () => {
    setFields((prev) => [...prev, { placeholder: 'Custom Field', type: 'text' }]);
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
    <ScrollableScreen>
      <View style={styles.container}>
        <Text style={STYLES.heading}>Add a New Exercise</Text>

        <Text style={styles.label}>Workout</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Chest"
          placeholderTextColor="#888"
          value={category}
          onChangeText={setCategory}
        />

        <Text style={styles.label}>Exercise Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Bench Press"
          placeholderTextColor={COLORS.placeholderTextColor}
          value={exerciseName}
          onChangeText={setExerciseName}
        />

        <View style={{ marginTop: 15 }}>
          <Button
            title="Choose Standard Template"
            onPress={() => setModalVisible(true)}
            color={COLORS.primary}
          />
          <Button
            title="Add Custom Field"
            onPress={handleAddCustomField}
            color={COLORS.primary} />
        </View>

        <Text style={styles.subHeading}>Current Fields:</Text>
        {fields.map((field, index) => (
          <View key={index} style={styles.fieldContainer}>
            <TextInput
              style={styles.fieldInput}
              value={field.label || ""}
              placeholder={field.placeholder || "Enter label"}
              placeholderTextColor={COLORS.placeholderTextColor}
              onChangeText={(text) => handleRenameField(index, text)}
            />
            <TouchableOpacity onPress={() => handleRemoveField(index)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}

        <Button title="Save Exercise" onPress={handleSaveExercise} color={COLORS.primary} />
        <TemplateModal visible={modalVisible} onClose={() => setModalVisible(false)} onSelectTemplate={handleSelectTemplate} />
      </View>
    </ScrollableScreen>
  );
};

export default ExerciseSetupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.textWhite,
    marginTop: 8,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    padding: 8,
    color: COLORS.textWhite,
    backgroundColor: COLORS.backgroundDark,
    marginBottom: 8,
  },
  subHeading: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textWhite,
    marginBottom: 8,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundDark,
    padding: 8,
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  fieldInput: {
    flex: 1,
    color: COLORS.textWhite,
    fontSize: 14,
    paddingHorizontal: 8,
  },
});
