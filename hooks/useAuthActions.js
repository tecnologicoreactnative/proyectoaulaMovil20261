import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function useAuthActions() {
  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email, password, userData = {}) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    // Crear documento de usuario con datos extendidos
    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      birthDate: userData.birthDate || null,
      role: "user",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return userCred;
  };

  return { signIn, signUp };
}
