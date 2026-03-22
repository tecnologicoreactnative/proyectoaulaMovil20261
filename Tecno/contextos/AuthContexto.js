import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const AuthContexto = createContext();

export const ProveedorAuth = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return unsubscribe;
  }, []);

  const cerrarSesion = () => {
    signOut(auth);
  };

  return (
    <AuthContexto.Provider value={{ usuario, cerrarSesion }}>
      {children}
    </AuthContexto.Provider>
  );
}; 
