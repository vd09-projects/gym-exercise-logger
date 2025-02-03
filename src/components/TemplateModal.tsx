// src/components/TemplateModal.tsx
import React from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity
} from 'react-native';

type Field = { label: string; type: string };

interface TemplateModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (fields: Field[]) => void;
}

const standardTemplates: Record<string, Field[]> = {
  Weightlifting: [
    { label: 'Sets', type: 'number' },
    { label: 'Weight', type: 'number' },
    { label: 'Reps', type: 'number' },
  ],
  Cardio: [
    { label: 'Time', type: 'number' },
    { label: 'Distance', type: 'number' },
  ],
  // Add more templates as needed
};

export default function TemplateModal({ visible, onClose, onSelectTemplate }: TemplateModalProps) {
  const templateNames = Object.keys(standardTemplates);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Choose a Template</Text>
          {templateNames.map((name) => (
            <TouchableOpacity
              key={name}
              style={styles.templateButton}
              onPress={() => onSelectTemplate(standardTemplates[name])}
            >
              <Text style={styles.templateText}>{name}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  title: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  templateButton: {
    backgroundColor: '#FF6A00',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  templateText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  closeText: {
    color: '#FFF',
    fontSize: 16,
  },
});