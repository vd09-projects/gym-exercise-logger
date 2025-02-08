import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuthUser } from '../hooks/useAuthUser';
import { COLORS, STYLES } from '../constants/theme';
import { COLLECTIONS } from '../constants/firestore';
import SearchableDropdown from '../components/SearchableDropdown';
import { DISPLAY_TITLE } from '../constants/DisplayText';

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
  const [dayLogs, setDayLogs] = useState<DayLogs[]>([]);

  // 1. Fetch all exercises for this user
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

  // 2. Filter categories & exercises
  const categories = Array.from(new Set(exercises.map((ex) => ex.category)));
  const filteredExercises = exercises.filter((ex) => ex.category === selectedCategory);

  // 3. Fetch last 5 distinct days for the chosen exercise
  useEffect(() => {
    if (!user || !selectedExerciseId) {
      setDayLogs([]);
      return;
    }
    const logsRef = collection(db, COLLECTIONS.USERS, user.uid, COLLECTIONS.EXERCISES, selectedExerciseId, COLLECTIONS.LOGS);
    const logsQuery = query(logsRef, orderBy('timestamp', 'desc'), limit(50));

    const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
      const allLogs: LogData[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        allLogs.push({
          id: docSnap.id,
          timestamp: data.timestamp.toDate(),
          values: data.values,
        });
      });

      const grouped = groupLogsByDay(allLogs);
      setDayLogs(grouped);
    });

    return () => unsubscribe();
  }, [user, selectedExerciseId]);

  // Group logs by day, up to 5 distinct days
  const groupLogsByDay = (logs: LogData[]): DayLogs[] => {
    const results: DayLogs[] = [];
    const dayMap: Record<string, LogData[]> = {};

    for (const log of logs) {
      const dayString = formatDayString(log.timestamp);
      if (!dayMap[dayString]) {
        dayMap[dayString] = [];
      }
      dayMap[dayString].push(log);
    }

    for (const log of logs) {
      const dayString = formatDayString(log.timestamp);
      if (!results.find((dl) => dl.dayString === dayString)) {
        if (results.length >= 5) break;
        results.push({ dayString, logs: [] });
      }
      const dayLogsEntry = results.find((dl) => dl.dayString === dayString);
      dayLogsEntry?.logs.push(log);
    }

    return results;
  };

  const formatDayString = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const renderRows = () => {
    return dayLogs.map((dayLog) =>
      dayLog.logs.map((log) => (
        <View key={log.id} style={styles.row}>
          <Text style={[styles.cell, styles.timestampCell]}>
            {log.timestamp.toLocaleString()}
          </Text>
          {Object.keys(log.values).map((key) => (
            <Text key={key} style={[styles.cell, styles.dataCell]}>
              {log.values[key]}
            </Text>
          ))}
        </View>
      ))
    );
  };

  const columnKeys =
    dayLogs.length > 0 && dayLogs[0].logs.length > 0
      ? Object.keys(dayLogs[0].logs[0].values)
      : [];

  return (
    <View style={styles.container}>
      <Text style={STYLES.heading}>Workout Progress</Text>

      <Text style={STYLES.title}>Workout</Text>
      <SearchableDropdown
        data={categories.map((cat) => ({ label: cat, value: cat }))}
        placeholder={DISPLAY_TITLE.Workout}
        value={selectedCategory}
        onChange={(value) => {
          setSelectedCategory(value);
          setSelectedExerciseId('');
        }}
      />

      {selectedCategory !== '' && (
        <>
          <Text style={STYLES.title}>Exercise</Text>
          <SearchableDropdown
            data={filteredExercises.map((ex) => ({ key: ex.id, label: ex.exerciseName, value: ex.id }))}
            placeholder={DISPLAY_TITLE.Exercise}
            value={selectedExerciseId}
            onChange={(value) => {
              setSelectedExerciseId(value);
            }}
          />
        </>
      )}

      {selectedExerciseId && (
        <>
          <Text style={[styles.label, { marginTop: 16 }]}>
            Last 5 days with logs for the selected exercise:
          </Text>

          {columnKeys.length > 0 && (
            <View style={styles.headerContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.cell, styles.headerCell, styles.timestampCell]}>
                  Timestamp
                </Text>
                {columnKeys.map((key) => (
                  <Text key={key} style={[styles.cell, styles.headerCell, styles.dataCell]}>
                    {key}
                  </Text>
                ))}
              </View>
            </View>
          )}

          <ScrollView style={styles.scrollArea}>
            {renderRows()}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textWhite,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: COLORS.textWhite,
    marginTop: 8,
    marginBottom: 4,
  },
  headerContainer: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: COLORS.primary,
    paddingBottom: 4,
  },
  scrollArea: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    marginTop: 4,
    padding: 8,
  },
  headerCell: {
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  timestampCell: {
    flex: 3,
    textAlign: 'left',
  },
  dataCell: {
    flex: 2,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: COLORS.dividerColor,
  },
  cell: {
    color: COLORS.textWhite,
    textAlign: 'center',
  },
});