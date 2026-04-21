import React, { createContext, useEffect, useState } from "react";
import { use } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Alert } from "react-native";
import { auth, db } from "../firebase";

const AuthContext = createContext({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUser = null;
    let unsubscribeProfile = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setLoading(false);
        if (unsubscribeProfile) unsubscribeProfile();
        return;
      }

      // Suscribirse a cambios en el documento de usuario
      const userRef = doc(db, "users", u.uid);
      unsubscribeProfile = onSnapshot(
        userRef,
        (profileDoc) => {
          const profileData = profileDoc.data() || {};
          setUser({
            uid: u.uid,
            email: u.email,
            firstName: profileData.firstName || "",
            lastName: profileData.lastName || "",
            birthDate: profileData.birthDate || null,
            role: profileData.role || "user",
          });
          setLoading(false);
        },
        (err) => {
          console.error("AuthContext: profile fetch error", err);
          // En caso de error, establecer usuario básico sin perfil
          setUser({
            uid: u.uid,
            email: u.email,
            firstName: "",
            lastName: "",
            birthDate: null,
            role: "user",
          });
          setLoading(false);
        }
      );
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
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
