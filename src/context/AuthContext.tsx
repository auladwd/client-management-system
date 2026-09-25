"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";

export const SUPER_ADMIN_EMAIL = "auladinfo@gmail.com";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: string;
  isSuperAdmin?: boolean;
  isDemo?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isConfigured: boolean;
  authError: string | null;
  clearAuthError: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isConfigured: false,
  authError: null,
  clearAuthError: () => {},
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  logout: async () => {},
  demoLogin: () => {},
});

const DEMO_USER_STORAGE_KEY = "aulad_it_demo_user";

async function verifyEmailAccess(email: string) {
  try {
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch (err) {
    if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return { allowed: true, role: "superadmin", isSuperAdmin: true, name: "Md. Aulad Hossen" };
    }
    return {
      allowed: false,
      error: "সার্ভারে ইউজার অনুমতি যাচাই করতে সমস্যা হয়েছে।",
    };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const configured = isFirebaseConfigured();

  const clearAuthError = () => setAuthError(null);

  useEffect(() => {
    // 1. Check for demo session if any
    const savedDemo = typeof window !== "undefined" ? localStorage.getItem(DEMO_USER_STORAGE_KEY) : null;
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setUser(parsed);
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      }
    }

    // 2. If Firebase auth is ready, listen to auth state changes
    if (!auth) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
        if (firebaseUser && firebaseUser.email) {
          const verifyResult = await verifyEmailAccess(firebaseUser.email);
          if (verifyResult.allowed) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: verifyResult.name || firebaseUser.displayName || firebaseUser.email.split("@")[0] || "এডমিন",
              photoURL: firebaseUser.photoURL,
              role: verifyResult.role || "admin",
              isSuperAdmin: verifyResult.isSuperAdmin ?? (firebaseUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()),
              isDemo: false,
            });
            setAuthError(null);
          } else {
            // Unauthorized email: kick out immediately
            if (auth) {
              await signOut(auth);
            }
            setUser(null);
            setAuthError(
              verifyResult.error ||
              `দুঃখিত (${firebaseUser.email}), আপনার এই পোর্টালে প্রবেশের অনুমতি নেই। শুধুমাত্র সুপার এডমিন (${SUPER_ADMIN_EMAIL}) এর অনুমোদিত ইমেইল প্রবেশ করতে পারবে।`
            );
          }
        } else {
          // If no Firebase user and no demo session
          const demoActive = typeof window !== "undefined" && localStorage.getItem(DEMO_USER_STORAGE_KEY);
          if (!demoActive) {
            setUser(null);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Auth state observer error:", e);
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    if (!auth || !googleProvider) {
      throw new Error("Firebase Auth কনফিগার করা হয়নি। দয়া করে .env.local ফাইলে ভ্যালিড Firebase ক্রেডেনশিয়াল দিন।");
    }
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user && result.user.email) {
      const verifyResult = await verifyEmailAccess(result.user.email);
      if (!verifyResult.allowed) {
        await signOut(auth);
        setUser(null);
        const errMsg =
          verifyResult.error ||
          `দুঃখিত (${result.user.email}), এই পোর্টালে প্রবেশের অনুমতি আপনার নেই। সুপার এডমিন (${SUPER_ADMIN_EMAIL}) এর অনুমতি আবশ্যক।`;
        setAuthError(errMsg);
        throw new Error(errMsg);
      }

      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: verifyResult.name || result.user.displayName,
        photoURL: result.user.photoURL,
        role: verifyResult.role,
        isSuperAdmin: verifyResult.isSuperAdmin,
        isDemo: false,
      });
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();

    // Check whitelist first
    const verifyResult = await verifyEmailAccess(cleanEmail);
    if (!verifyResult.allowed) {
      const errMsg =
        verifyResult.error ||
        `দুঃখিত (${cleanEmail}), এই পোর্টালে আপনার প্রবেশের অনুমতি নেই। শুধুমাত্র সুপার এডমিন (${SUPER_ADMIN_EMAIL}) এর অনুমোদিত ইমেইল প্রবেশ করতে পারবে।`;
      setAuthError(errMsg);
      throw new Error(errMsg);
    }

    if (!auth) {
      throw new Error("Firebase Auth চালু করা সম্ভব হয়নি। .env.local ফাইলে Firebase চাবিগুলো দিন।");
    }

    const result = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    if (result.user) {
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: verifyResult.name || result.user.displayName || cleanEmail.split("@")[0] || "এডমিন",
        photoURL: result.user.photoURL,
        role: verifyResult.role,
        isSuperAdmin: verifyResult.isSuperAdmin,
        isDemo: false,
      });
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();

    // Check whitelist
    const verifyResult = await verifyEmailAccess(cleanEmail);
    if (!verifyResult.allowed) {
      const errMsg =
        verifyResult.error ||
        `রেজিস্ট্রেশন ব্যর্থ: (${cleanEmail}) ইমেইলটির এই সিস্টেমে কোনো অনুমতি নেই। এডমিন অনুমতি দিলে তবেই একাউন্ট তৈরি করতে পারবেন।`;
      setAuthError(errMsg);
      throw new Error(errMsg);
    }

    if (!auth) {
      throw new Error("Firebase Auth চালু করা সম্ভব হয়নি। .env.local ফাইলে Firebase চাবিগুলো দিন।");
    }

    const result = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    if (result.user) {
      if (name.trim()) {
        await updateProfile(result.user, { displayName: name.trim() });
      }
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: name.trim() || cleanEmail.split("@")[0] || "এডমিন",
        photoURL: result.user.photoURL,
        role: verifyResult.role,
        isSuperAdmin: verifyResult.isSuperAdmin,
        isDemo: false,
      });
    }
  };

  const logout = async () => {
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error("Sign out error:", e);
      }
    }
    setUser(null);
  };

  const demoLogin = () => {
    const demoAdmin: AuthUser = {
      uid: "superadmin-auladinfo",
      email: SUPER_ADMIN_EMAIL,
      displayName: "Md. Aulad Hossen (সুপার এডমিন)",
      photoURL: null,
      role: "superadmin",
      isSuperAdmin: true,
      isDemo: true,
    };
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoAdmin));
    setUser(demoAdmin);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: configured,
        authError,
        clearAuthError,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
