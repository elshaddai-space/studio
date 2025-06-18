
// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Ensure your Firebase config values are correctly set in your .env.local file
// and that you have restarted your Next.js development server after changes.
// Example .env.local:
// NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
// ... etc.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
// Check if all necessary config values are present before initializing
let app;
if (
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} else {
  console.error(
    "Firebase configuration is missing or incomplete. " +
    "Please check your .env.local file and ensure all NEXT_PUBLIC_FIREBASE_ variables are set."
  );
  // You might want to throw an error here or handle this case appropriately
  // For now, app will be undefined, and subsequent Firebase calls will likely fail
}

// Get Auth instance only if app was initialized
const auth = app ? getAuth(app) : null;

// Throw an error if auth could not be initialized, which implies app was not initialized.
if (!auth) {
  // This check is a bit redundant if the console.error above already fired,
  // but it makes the failure explicit if app initialization was silently skipped.
  // The original FirebaseError (auth/invalid-api-key) is usually thrown by getAuth(app)
  // if 'app' is initialized with an invalid apiKey.
  // If 'app' itself is undefined because critical config is missing, getAuth(undefined) would also error.
  console.error("Firebase Auth could not be initialized. This is likely due to missing Firebase config in .env.local.");
}


export { app, auth };
