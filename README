# GymLogger App  

A React Native application for creating, organizing, and logging workout routines. You can create custom exercises or select from predefined templates, log your workouts, and track progress over time. This app uses Firebase for authentication and Firestore as its database.  

## Table of Contents  
- [Features](#features)  
- [Prerequisites](#prerequisites)  
- [Installation and Setup](#installation-and-setup)  
- [Running the App](#running-the-app)  
- [Testing](#testing)  
- [Future Goals](#future-goals)  

## Features  
1. **User Authentication**  
   - Sign up / Sign in using Firebase Authentication  
   - Persists user sessions  

2. **Exercise Setup**  
   - Create new exercise categories (e.g., Chest, Legs) and exercises (e.g., Bench Press, Squats)  
   - Use a predefined template (e.g., Weightlifting, Cardio) or create custom fields (e.g., Sets, Reps, Weight)  

3. **Exercise Logging**  
   - Log exercise data including custom fields (e.g., sets, reps, weights)  
   - Automatically stores logs in Firestore with timestamps  

4. **Progress Tracking**  
   - Fetch and display the most recent logs  
   - Group logs by date for easy reference  

5. **Dynamic UI**  
   - Animated transitions between screens  
   - Layout with custom Header and Footer for navigation  

## Prerequisites  
- Node.js (v14 or above recommended)  
- npm or Yarn  
- Expo CLI (optional but recommended for development)  
- A Firebase account and a configured Firebase project  
- You will need to add your Firebase credentials in a `.env` file or supply them in the environment (see Installation and Setup)  

## Installation and Setup  

1. Clone the repository  

   ```sh  
   git clone <repository-url> GymLogger  
   cd GymLogger  
   ```  

2. Install dependencies  

   ```sh  
   npm install  
   ```  

   **Or using Yarn:**  

   ```sh  
   yarn  
   ```  

3. Configure Firebase  
   - In this project, we load Firebase configuration from environment variables stored in a `.env` file.  
   - Create a file named `.env` in the project root with the following keys:
   ```
   API_KEY=<YOUR_FIREBASE_API_KEY>
   AUTH_DOMAIN=<YOUR_FIREBASE_AUTH_DOMAIN>
   PROJECT_ID=<YOUR_FIREBASE_PROJECT_ID>
   STORAGE_BUCKET=<YOUR_FIREBASE_STORAGE_BUCKET>
   MESSAGING_SENDER_ID=<YOUR_SENDER_ID>
   APP_ID=<YOUR_APP_ID>
   ```
   - These values should match your Firebase app credentials from the Firebase console.  

## Running the App  

1. Start the Metro bundler (using Expo):  

```sh  
npm run start  
```  

**Or using Yarn:**  

```sh  
yarn start  
```  

2. Open the Expo app on your mobile device or emulator:  
- For **iOS**: Press `i` in the terminal to open in the iOS simulator (Mac only).  
- For **Android**: Press `a` in the terminal to open in the Android emulator.  
- Alternatively, scan the QR code with the Expo Go app on your physical device.  

3. Sign Up / Sign In with your credentials. Once logged in, you can start setting up exercises, logging workouts, and viewing your progress.  

## Testing  

### Unit / Integration Tests  

If you have tests configured (e.g., using Jest), you can run:  

```sh  
npm run test  
```  

**Or using Yarn:**  

```sh  
yarn test  
```  

This will execute any test suites in the `__tests__` directory or files with `.test.ts/.js` suffixes (depending on your Jest config).  

### Manual Testing  

Since this is a React Native project, much of the testing will be done manually through the Expo client. Ensure you:  
1. Create an account or sign in with an existing one.  
2. Add new exercises and log them.  
3. Verify the logs appear in the Progress tab.  

## Future Goals  

1. **Enhanced Validation for Logged Data**  
   - Ensure that reps or weights are integers or valid numbers.  
   - Check that required fields are not empty.  
   - Log errors or display feedback if invalid data is entered.  

2. **Improved Validation During Exercise Setup**  
   - Validate that custom exercise names are non-empty.  
   - Validate all required fields are filled in before saving a new exercise.  
   - Enforce rules on field types (number, text, etc.) to ensure consistent data entry.  

These improvements will help maintain data integrity and provide users with more helpful feedback when creating or logging their exercises.  

---  

Thank you for checking out the GymLogger App! If you have any questions or want to contribute, feel free to open an issue or make a pull request. **Happy logging!**  