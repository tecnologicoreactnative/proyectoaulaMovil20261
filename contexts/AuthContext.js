import React, { createContext, useEffect, useState, useCallback } from "react";
import { use } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Alert } from "react-native";
import { auth, db } from "../firebase";
import useNotifications from "../hooks/useNotifications";

const AuthContext = createContext({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { registerForPushNotifications, unregisterPushNotifications } =
    useNotifications();

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

          // Registrar push token después de que el perfil se haya inicializado
          // Usar un pequeño delay para permitir que Firestore termine de escribir el perfil
          setTimeout(() => {
            registerForPushNotifications(u.uid);
          }, 2000);
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

          // Aun sin perfil, intentar registrar token
          setTimeout(() => {
            registerForPushNotifications(u.uid);
          }, 2000);
        }
      );
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, [registerForPushNotifications]);

  const signOut = useCallback(async () => {
    try {
      const currentUid = user?.uid;

      // Limpiar token de notificaciones antes de cerrar sesión
      if (currentUid) {
        await unregisterPushNotifications(currentUid);
      }

      await firebaseSignOut(auth);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  }, [user, unregisterPushNotifications]);

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return use(AuthContext);
}
