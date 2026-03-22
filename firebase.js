import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// configuration values are now read from environment variables
// you'll need to install and configure a dotenv solution
// e.g. react-native-dotenv (see babel.config.js below)

const firebaseConfig = {
  apiKey: "AIzaSyBcYaTYlG6VjJHcwZ3mSSULZ5nYjAUKRlQ",
  authDomain: "bibloteca-tdea.firebaseapp.com",
  projectId: "bibloteca-tdea",
  storageBucket: "bibloteca-tdea.appspot.com",
  messagingSenderId: "626396455092",
  appId: "1:626396455092:web:0678c75bce1f4ad823f7e1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
