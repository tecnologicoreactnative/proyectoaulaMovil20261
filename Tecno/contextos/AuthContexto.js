import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';

export const AuthContexto = createContext();

export const ProveedorAuth = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState('usuario');
  const [notificaciones, setNotificaciones] = useState([]);

  const cargarNotificaciones = async (userId) => {
    try {
      const inscSnap = await getDocs(query(collection(db, 'inscripciones'), where('userId', '==', userId)));
      const eventIds = inscSnap.docs.map(d => d.data().eventId);
      if (eventIds.length === 0) return;

      const userSnap = await getDoc(doc(db, 'usuarios', userId));
      const vistas = userSnap.exists() ? (userSnap.data().notificacionesVistas || []) : [];

      const notifSnap = await getDocs(collection(db, 'notificaciones'));
      const todas = notifSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(n => eventIds.includes(n.eventId) && !vistas.includes(n.id));

      // Solo la notificación más reciente por evento
      const porEvento = {};
      todas.forEach(n => {
        const fechaN = n.fecha?.seconds || 0;
        if (!porEvento[n.eventId] || fechaN > (porEvento[n.eventId].fecha?.seconds || 0)) {
          porEvento[n.eventId] = n;
        }
      });

      setNotificaciones(Object.values(porEvento));
    } catch (e) {
      console.log('Error cargando notificaciones:', e);
    }
  };

  const descartarNotificacion = async (notifId) => {
    setNotificaciones(prev => prev.filter(n => n.id !== notifId));
    if (!usuario) return;
    try {
      const userRef = doc(db, 'usuarios', usuario.uid);
      const snap = await getDoc(userRef);
      const vistas = snap.exists() ? (snap.data().notificacionesVistas || []) : [];
      if (snap.exists()) {
        await updateDoc(userRef, { notificacionesVistas: [...vistas, notifId] });
      }
    } catch (e) {
      console.log('Error descartando notificación:', e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUsuario(user);
      if (user) {
        const snap = await getDoc(doc(db, 'usuarios', user.uid));
        setRol(snap.exists() ? snap.data().rol : 'usuario');
        cargarNotificaciones(user.uid);
      } else {
        setRol('usuario');
        setNotificaciones([]);
      }
    });
    return unsubscribe;
  }, []);

  const cerrarSesion = () => signOut(auth);

  return (
    <AuthContexto.Provider value={{ usuario, rol, cerrarSesion, notificaciones, descartarNotificacion, cargarNotificaciones }}>
      {children}
    </AuthContexto.Provider>
  );
};
