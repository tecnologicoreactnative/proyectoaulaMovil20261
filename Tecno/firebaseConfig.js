import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDBigVuMiRrfiunEW13hbtGx4KIbLyKEfw",
  authDomain: "attevents-57852.firebaseapp.com",
  projectId: "attevents-57852",
  storageBucket: "attevents-57852.firebasestorage.app",
  messagingSenderId: "342294109362",
  appId: "1:342294109362:web:81b4245842ed2ef56efdab",
  measurementId: "G-HSVQG9G73T"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export { auth, db }; 
