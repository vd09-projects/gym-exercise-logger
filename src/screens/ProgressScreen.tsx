import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuthUser } from '../hooks/useAuthUser';

interface LogEntry {
    id: string;
    timestamp: any;
    values: { [key: string]: string };
    exerciseId: string;
}

export default function ProgressScreen() {
    const { user } = useAuthUser();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [showPicker, setShowPicker] = useState(false); // Show date picker only on button click

    const handleDateChange = (event: any, date?: Date) => {
        if (date) {
            setSelectedDate(date);
        }
        setShowPicker(false); // Hide the picker after selection
    };

    const fetchLogsForDay = () => {
        if (!user) return;
        setLogs([]); // Clear previous logs before fetching

        console.log("fetchLogsForDay")
        const exercisesRef = collection(db, 'users', user.uid, 'exercises');
        onSnapshot(exercisesRef, (exerciseSnapshot) => {
            exerciseSnapshot.forEach((exerciseDoc) => {
                const exerciseId = exerciseDoc.id;
                console.log("exerciseId", exerciseId)

                // Define start and end of the selected day
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
                console.log("logsQuery", startOfDay, endOfDay)

                onSnapshot(logsQuery, (logsSnapshot) => {
                    const dayLogs: LogEntry[] = [];
                    logsSnapshot.forEach((logDoc) => {
                        console.log("logDoc", logDoc.id, logDoc.data(), logDoc.data().timestamp)
                        dayLogs.push({
                            id: logDoc.id,
                            timestamp: logDoc.data().timestamp.toDate(),
                            values: logDoc.data().values,
                            exerciseId,
                        });
                    });

                    setLogs((prev) => [...prev, ...dayLogs]); // Append new logs
                });
            });
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Progress Screen</Text>

            {/* Date Picker Button */}
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
                <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
            </TouchableOpacity>

            {/* Date Picker (Shown Only on Button Click) */}
            {showPicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                />
            )}

            {/* Fetch Logs Button */}
            <Button title="Fetch Logs" onPress={fetchLogsForDay} />

            {/* Show logs */}
            <Text style={styles.subtitle}>Logs for {selectedDate.toDateString()}</Text>
            <FlatList
                data={logs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.logItem}>
                        <Text>Exercise ID: {item.exerciseId}</Text>
                        <Text>Timestamp: {new Date(item.timestamp).toLocaleString()}</Text>
                        {Object.keys(item.values).map((field) => (
                            <Text key={field}>
                                {field}: {item.values[field]}
                            </Text>
                        ))}
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    subtitle: { fontSize: 16, marginTop: 10, marginBottom: 4 },
    dateButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
        marginVertical: 8,
    },
    dateText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    logItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginVertical: 4,
        borderRadius: 6,
    },
});