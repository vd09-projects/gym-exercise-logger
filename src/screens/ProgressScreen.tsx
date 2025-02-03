// src/screens/ProgressScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuthUser } from '../hooks/useAuthUser';
import TableRow from '../components/TableRow';

interface LogEntry {
  id: string;
  timestamp: Date;
  values: { [key: string]: string };
  exerciseId: string;
  exerciseName?: string;    // We’ll store the exercise name after we fetch it
}

export default function ProgressScreen() {
  const { user } = useAuthUser();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    if (date) setSelectedDate(date);
    setShowPicker(false);
  };

  const fetchLogsForDay = () => {
    if (!user) return;
    setLogs([]);

    const exercisesRef = collection(db, 'users', user.uid, 'exercises');
    onSnapshot(exercisesRef, (exerciseSnapshot) => {
      exerciseSnapshot.forEach(async (exerciseDocSnap) => {
        const exerciseId = exerciseDocSnap.id;
        const exerciseName = exerciseDocSnap.data().exerciseName;

        // define day range
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const logsRef = collection(db, 'users', user.uid, 'exercises', exerciseId, 'logs');
        const logsQuery = query(
          logsRef,
          where('timestamp', '>=', startOfDay),
          where('timestamp', '<=', endOfDay),
          orderBy('timestamp', 'asc')
        );

        onSnapshot(logsQuery, (logsSnapshot) => {
          const dayLogs: LogEntry[] = [];
          logsSnapshot.forEach((logDoc) => {
            const data = logDoc.data();
            dayLogs.push({
              id: logDoc.id,
              timestamp: data.timestamp.toDate(),
              values: data.values,
              exerciseId: exerciseId,
              exerciseName: exerciseName, // attach name here
            });
          });
          setLogs((prev) => [...prev, ...dayLogs]);
        });
      });
    });
  };

  // Basic date formatting
  const formatTimestamp = (date: Date) => {
    return date.toLocaleString(); // or use date-fns for advanced formatting
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Progress</Text>

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
        <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      <View style={{ marginVertical: 8 }}>
        <Button title="Fetch Logs" onPress={fetchLogsForDay} color="#FF6A00" />
      </View>

      <Text style={styles.subtitle}>Logs for {selectedDate.toDateString()}</Text>

      {/* Tabular Display */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Exercise</Text>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Timestamp</Text>
        <Text style={[styles.tableHeaderText, { flex: 3 }]}>Fields</Text>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <TableRow
              exerciseName={item.exerciseName || 'N/A'}
              timestamp={formatTimestamp(item.timestamp)}
              values={item.values}
            />
          );
        }}
      />
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: '#FF6A00',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 8,
  },
  dateText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 4,
    color: '#FFF',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#FF6A00',
    paddingBottom: 6,
    marginBottom: 6,
  },
  tableHeaderText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});