import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB0wHPwd7s_mYHbZsxEjmTfyiddyUjzqZE",
  authDomain: "autentificacionfirebase-4db79.firebaseapp.com",
  projectId: "autentificacionfirebase-4db79",
  storageBucket: "autentificacionfirebase-4db79.firebasestorage.app",
  messagingSenderId: "221290130489",
  appId: "1:221290130489:web:4b3182ac9866bc680cf1e8",
  measurementId: "G-MR9QF5RL7K"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };
