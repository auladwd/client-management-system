import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

export function isFirebaseConfigured(): boolean {
  const key = firebaseConfig.apiKey;
  return Boolean(
    key &&
    key !== "AIzaSy..." &&
    !key.includes("...") &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== "aulad-it-solution" ||
    (Boolean(key) && key.length > 20 && !key.includes("..."))
  );
}

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;

try {
  if (typeof window !== "undefined" || process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: "select_account",
    });
  }
} catch (error) {
  console.warn("Firebase initialization notice:", error);
}

export { app, auth, googleProvider, firebaseConfig };
