import React, { createContext, useEffect, useState } from "react";
import { use } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { Alert } from "react-native";
import { auth } from "../firebase";

const AuthContext = createContext({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return use(AuthContext);
}
