import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainNavigator';
import { useAuthUser } from '../hooks/useAuthUser';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { user } = useAuthUser();

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            // handle error
        }
    };

    return (
        <View style={styles.container}>
            <Button
                title="Go to Exercise Setup"
                onPress={() => navigation.navigate('ExerciseSetup')}
            />
            <Button
                title="Go to Exercise Logger"
                onPress={() => navigation.navigate('ExerciseLog')}
            />
            <Button
                title="Go to Exercise Progress"
                onPress={() => navigation.navigate('Progress')}
            />
            {user && (
                <Button
                    title="Log Out"
                    onPress={handleLogout}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
});