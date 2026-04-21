import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import styles from './styles/DetailsStyles';
import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const DetailsScreen = ({ route }) => {
  const { eventoId } = route.params;
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [inscrito, setInscrito] = useState(false);

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        const docRef = doc(db, 'eventos', eventoId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvento(docSnap.data());
        }
        const userId = auth.currentUser?.uid;
        if (userId) {
          const q = query(
            collection(db, 'inscripciones'),
            where('eventId', '==', eventoId),
            where('userId', '==', userId)
          );
          const snapshot = await getDocs(q);
          if (!snapshot.empty) setInscrito(true);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarDetalle();
  }, [eventoId]);

  const inscribirse = async () => {
    try {
      const eventoRef = doc(db, 'eventos', eventoId);
      const eventoSnap = await getDoc(eventoRef);
      const cuposActuales = eventoSnap.data().cuposDisponibles;

      console.log('Cupos actuales:', cuposActuales);

      if (cuposActuales <= 0) {
        Alert.alert('Sin cupos', 'Este evento no tiene cupos disponibles.');
        return;
      }

      await addDoc(collection(db, 'inscripciones'), {
        eventId: eventoId,
        userId: auth.currentUser?.uid,
        fechaInscripcion: new Date()
      });

      await updateDoc(eventoRef, {
        cuposDisponibles: cuposActuales - 1
      });

      setInscrito(true);
      setEvento(prev => ({ ...prev, cuposDisponibles: cuposActuales - 1 }));
      Alert.alert('¡Éxito!', 'Te has inscrito al evento.');
    } catch (error) {
      console.error('Error al inscribirse:', error);
      Alert.alert('Error', 'No se pudo inscribir.');
    }
  };

  if (cargando) return <ActivityIndicator size="large" color="#4A90E2" style={styles.centrado} />;
  if (!evento) return <Text style={styles.centrado}>Evento no encontrado.</Text>;

  const formatearFecha = (fechaFirebase) => {
    if (fechaFirebase && fechaFirebase.seconds) {
      return new Date(fechaFirebase.seconds * 1000).toLocaleDateString();
    }
    return 'Fecha no disponible';
  };

  return (
    <View style={styles.fondo}>
      <View style={styles.tarjetaBlanca}>
        <Text style={styles.titulo}>{evento.titulo || 'Sin título'}</Text>
        <Text style={styles.organizador}>Organiza: {evento.organizador || 'Universidad'}</Text>

        <View style={styles.separador} />

        <Text style={styles.textoBasico}>📍 Lugar: {evento.lugar || 'Por definir'}</Text>
        <Text style={styles.textoBasico}>📅 Fecha: {formatearFecha(evento.fecha)}</Text>
        <Text style={styles.textoBasico}>🕐 Hora: {evento.Hora || 'Consultar'}</Text>
        <Text style={styles.textoBasico}>👥 Cupos disponibles: {evento.cuposDisponibles ?? evento['Cupos totales'] ?? '30'}</Text>

        <Text style={[styles.subtitulo, { marginTop: 15 }]}>Descripción</Text>
        <Text style={styles.descripcion}>{evento.descripcion || 'Sin descripción.'}</Text>
      </View>

      {inscrito ? (
        <View style={styles.cajaExito}>
          <Text style={styles.textoExito}>✅ Ya estás inscrito en este evento</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.botonInscribir} onPress={inscribirse}>
          <Text style={styles.textoBoton}>Inscribirme al Evento</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DetailsScreen; 