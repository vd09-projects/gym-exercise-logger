// src/screens/ProgressScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuthUser } from '../hooks/useAuthUser';

interface Exercise {
  id: string;
  category: string;
  exerciseName: string;
  fields: { label: string; type: string }[];
}

interface LogData {
  id: string;
  timestamp: Date;
  values: { [key: string]: string };
}

// We'll group logs by "dayString" (e.g., "2025-02-03")
interface DayLogs {
  dayString: string;
  logs: LogData[];
}

export default function ProgressScreen() {
  const { user } = useAuthUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [dayLogs, setDayLogs] = useState<DayLogs[]>([]); // array of grouped logs

  // 1. Fetch all exercises for this user, store them in state
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

  // 2. Filter categories & exercises
  const categories = Array.from(new Set(exercises.map((ex) => ex.category)));
  const filteredExercises = exercises.filter((ex) => ex.category === selectedCategory);

  // 3. Once the user selects an exercise, fetch the last 5 distinct days of logs
  useEffect(() => {
    if (!user || !selectedExerciseId) {
      setDayLogs([]);
      return;
    }
    // reference to logs subcollection for chosen exercise
    const logsRef = collection(db, 'users', user.uid, 'exercises', selectedExerciseId, 'logs');
    // order by timestamp descending, limit e.g. 50
    const logsQuery = query(logsRef, orderBy('timestamp', 'desc'), limit(50));

    const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
      // parse logs in descending order
      const allLogs: LogData[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        allLogs.push({
          id: docSnap.id,
          timestamp: data.timestamp.toDate(),
          values: data.values,
        });
      });

      // group logs by day, stopping after 5 distinct days
      const grouped = groupLogsByDay(allLogs);
      setDayLogs(grouped);
    });

    return () => unsubscribe();
  }, [user, selectedExerciseId]);

  // Helper: group logs by day, stopping after 5 distinct days
  const groupLogsByDay = (logs: LogData[]): DayLogs[] => {
    const dayMap: { [dayString: string]: LogData[] } = {};
    const results: DayLogs[] = [];
    let distinctDaysCount = 0;

    for (const log of logs) {
      const dayString = formatDayString(log.timestamp);
      if (!dayMap[dayString]) {
        dayMap[dayString] = [];
      }
      dayMap[dayString].push(log);
    }

    // logs are in descending order by timestamp, so dayMap is not sorted
    // we need to iterate logs again or sort the keys. We'll do it by
    // re-constructing from the original order.
    for (const log of logs) {
      const dayString = formatDayString(log.timestamp);
      // if we haven't added dayString yet, create a new DayLogs
      const existing = results.find((dl) => dl.dayString === dayString);
      if (!existing) {
        if (results.length >= 5) break; // we already have 5 distinct days
        results.push({ dayString, logs: [] });
      }
      // push the log into that day's array
      const dayLogsEntry = results.find((dl) => dl.dayString === dayString);
      dayLogsEntry?.logs.push(log);
    }

    return results;
  };

  // format the day (e.g. "2025-02-12")
  const formatDayString = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Progress</Text>

      {/*  Category Picker */}
      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          style={styles.picker}
          dropdownIconColor="#FF6A00"
          selectedValue={selectedCategory}
          onValueChange={(val) => {
            setSelectedCategory(val);
            setSelectedExerciseId('');
          }}
        >
          <Picker.Item label="-- Choose a Category --" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      {/* Exercise Picker */}
      {selectedCategory !== '' && (
        <>
          <Text style={styles.label}>Exercise</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              style={styles.picker}
              dropdownIconColor="#FF6A00"
              selectedValue={selectedExerciseId}
              onValueChange={(val) => setSelectedExerciseId(val)}
            >
              <Picker.Item label="-- Choose an Exercise --" value="" />
              {filteredExercises.map((ex) => (
                <Picker.Item key={ex.id} label={ex.exerciseName} value={ex.id} />
              ))}
            </Picker>
          </View>
        </>
      )}

      {/* Show last 5 days of logs in a scrollable table */}
      <Text style={[styles.label, { marginTop: 16 }]}>
        Last 5 days with logs for selected exercise:
      </Text>

      <ScrollView style={styles.tableContainer}>
        {dayLogs.length > 0 && (
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.headerCellTimeStamp]}>
              Timestamp
            </Text>

            {Object.keys(dayLogs[0].logs[0]?.values || {}).map((key) => (
              <Text key={key} style={[styles.cell, styles.headerCell]}>
                {key}
              </Text>
            ))}
          </View>
        )}

        {dayLogs.map((dayLog) => (
          dayLog.logs.map((log) => (
            <View key={log.id} style={styles.row}>
              <Text style={[styles.cell, styles.headerCellTimeStamp, {color: '#FFF'}]}>
                {log.timestamp.toLocaleString()}
              </Text>

              {Object.keys(log.values).map((key) => (
                <Text key={key} style={[styles.cell, styles.headerCell, {color: '#FFF'}]}>{log.values[key]}</Text>
              ))}
            </View>
          ))
        ))}
      </ScrollView>
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
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 8,
    marginBottom: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#FF6A00',
    borderRadius: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },
  picker: {
    color: '#FFF',
    backgroundColor: '#1A1A1A',
  },
  tableContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FF6A00',
    borderRadius: 6,
    padding: 8,
  },
  daySection: {
    marginBottom: 16,
  },
  dayHeader: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#FF6A00',
    paddingBottom: 4,
    marginBottom: 4,
  },
  headerCellTimeStamp: {
    flex: 3,
    fontWeight: 'bold',
    color: '#FF6A00',
    textAlign: 'left',
  },
  headerCell: {
    flex: 2,
    fontWeight: 'bold',
    color: '#FF6A00',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  cell: {
    color: '#FFF',
  },
});