import { db } from '../services/firebase/firebaseConfig';
import {
  collection,
  doc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  Timestamp,
  getDoc,
  updateDoc,
  setDoc,
  arrayUnion,
  collectionGroup,
  getDocs,
} from "firebase/firestore";

const TABLES = {
  USERS: "users",
  WORKOUT_PLANS: "workoutPlans",
  EXERCISES: "exercises",
  LOGS: "logs",
  UNIQUE_EXERCISES: "uniqueExercises", // NEW COLLECTION
};

/**
 * Type definitions
 */
export interface WorkoutLog {
  id: string;
  timestamp: Date;
  values: Record<string, any>;
}

/**
 * Save workout log under a specific user and workout plan
 */
export const saveWorkoutLog = async (
  userId: string,
  workoutPlanId: string,
  exerciseId: string,
  fieldValues: Record<string, any>
): Promise<{ success: boolean; message: string }> => {
  if (!userId || !workoutPlanId || !exerciseId) {
    throw new Error("User ID, Workout Plan ID, and Exercise ID are required.");
  }

  try {
    const exerciseDocRef = doc(db, TABLES.USERS, userId, TABLES.WORKOUT_PLANS, workoutPlanId, TABLES.EXERCISES, exerciseId);
    await addDoc(collection(exerciseDocRef, TABLES.LOGS), {
      timestamp: Timestamp.now(),
      values: { ...fieldValues },
    });

    return { success: true, message: "Workout log saved!" };
  } catch (error) {
    console.error("Error saving workout log:", error);
    throw new Error("Could not save log.");
  }
};

/**
 * Fetch workout logs for a specific workout plan and exercise
 */
export const getWorkoutLogs = (
  userId: string,
  workoutPlanId: string,
  exerciseId: string,
  callback: (logs: WorkoutLog[]) => void
): (() => void) => {
  if (!userId || !workoutPlanId || !exerciseId) return () => { };

  const logsRef = collection(db, TABLES.USERS, userId, TABLES.WORKOUT_PLANS, workoutPlanId, TABLES.EXERCISES, exerciseId, TABLES.LOGS);
  const logsQuery = query(logsRef, orderBy("timestamp", "desc"), limit(50));

  const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
    const allLogs: WorkoutLog[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        timestamp: data.timestamp.toDate(),
        values: data.values,
      };
    });

    callback(allLogs);
  });

  return unsubscribe;
};

/**
 * Creates a new workout plan and returns its generated ID.
 */
const createWorkoutPlan = async (userId: string, workoutPlanName: string): Promise<string> => {
  const newPlanRef = await addDoc(collection(db, TABLES.USERS, userId, TABLES.WORKOUT_PLANS), {
    name: workoutPlanName,
    createdAt: Timestamp.now(),
  });

  console.log(`✅ Created new workout plan: '${workoutPlanName}' (ID: ${newPlanRef.id})`);
  return newPlanRef.id;
};

/**
 * Adds an exercise to a workout plan and returns its generated ID.
 */
const addExerciseToWorkoutPlan = async (
  userId: string,
  workoutPlanId: string,
  exerciseName: string,
  fields: string[]
): Promise<string> => {
  const exerciseRef = await addDoc(
    collection(db, TABLES.USERS, userId, TABLES.WORKOUT_PLANS, workoutPlanId, TABLES.EXERCISES),
    { exerciseName, fields }
  );

  console.log(`✅ Saved exercise '${exerciseName}' (ID: ${exerciseRef.id}) under Workout Plan ID: ${workoutPlanId}`);
  return exerciseRef.id;
};

/**
 * Updates the `uniqueExercises` collection to track which workout plans contain this exercise.
 */
const updateUniqueExercises = async (exerciseId: string, exerciseName: string, workoutPlanId: string) => {
  const uniqueExerciseRef = doc(db, TABLES.UNIQUE_EXERCISES, exerciseId);
  const uniqueExerciseSnap = await getDoc(uniqueExerciseRef);

  if (uniqueExerciseSnap.exists()) {
    // Update existing exercise entry
    await updateDoc(uniqueExerciseRef, {
      workoutPlans: arrayUnion(workoutPlanId),
    });
  } else {
    // Create a new entry for the exercise
    await setDoc(uniqueExerciseRef, {
      name: exerciseName,
      workoutPlans: [workoutPlanId],
    });
  }

  console.log(`✅ Updated 'uniqueExercises' for '${exerciseName}' (ID: ${exerciseId})`);
};

/**
 * Save a new exercise under a workout plan.
 * If `workoutPlanId` is undefined, create a new workout plan first.
 * Also updates the `uniqueExercises` collection.
 */
export const saveExercise = async (
  userId: string,
  workoutPlanId: string | undefined,
  workoutPlanName: string,
  exerciseName: string,
  fields: string[]
): Promise<{ success: boolean; message: string; newWorkoutPlanId?: string }> => {
  if (!userId || !workoutPlanName.trim() || !exerciseName.trim()) {
    throw new Error("❌ User ID, Workout Plan Name, and Exercise Name are required.");
  }

  try {
    // Ensure we have a valid workout plan ID
    const finalWorkoutPlanId = workoutPlanId || (await createWorkoutPlan(userId, workoutPlanName));

    // Add exercise to the workout plan
    const exerciseId = await addExerciseToWorkoutPlan(userId, finalWorkoutPlanId, exerciseName, fields);

    // Update `uniqueExercises` collection
    await updateUniqueExercises(exerciseId, exerciseName, finalWorkoutPlanId);

    return {
      success: true,
      message: `✅ Exercise '${exerciseName}' saved under '${workoutPlanName}'!`,
      newWorkoutPlanId: workoutPlanId ? undefined : finalWorkoutPlanId,
    };
  } catch (error) {
    console.error("❌ Error saving exercise:", error);
    throw new Error("Could not save exercise.");
  }
};

/**
 * Fetch the latest workout log entry for a given user.
 * Searches across all workout plans and exercises, sorted by timestamp (latest first).
 */
export const getLastLogEntry = async (userId: string): Promise<{ success: boolean; log?: any; message?: string }> => {
  if (!userId) {
    throw new Error("❌ User ID is required.");
  }

  try {
    // Query logs across all workout plans and exercises for this user
    const logsQuery = query(
      collectionGroup(db, TABLES.LOGS),  // Searches across all "logs" subcollections
      orderBy("timestamp", "desc"),      // Orders logs by latest timestamp
      limit(1)                           // Retrieves only the most recent entry
    );

    const querySnapshot = await getDocs(logsQuery);

    if (querySnapshot.empty) {
      return { success: false, message: "No log entries found for this user." };
    }

    const latestLog = querySnapshot.docs[0].data();

    return { success: true, log: latestLog };
  } catch (error) {
    console.error("❌ Error fetching last log entry:", error);
    return { success: false, message: "Could not retrieve last log entry." };
  }
};