import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import styles from './styles/MisEventosStyles';
import { useFocusEffect } from '@react-navigation/native';

const MisEventosScreen = ({ navigation }) => {
  const [misEventos, setMisEventos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarMisEventos = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const q = query(collection(db, 'inscripciones'), where('userId', '==', userId)); 
      const snapshot = await getDocs(q);

      const eventosPromesas = snapshot.docs.map(async (inscripcion) => {
        const datos = inscripcion.data();
        const eventoRef = doc(db, 'eventos', datos.eventId);
        const eventoSnap = await getDoc(eventoRef);
        return {
          inscripcionId: inscripcion.id,
          eventId: datos.eventId,
          ...eventoSnap.data()
        };
      });

      const eventos = await Promise.all(eventosPromesas);
      setMisEventos(eventos);
    } catch (error) {
      console.error('Error al cargar mis eventos:', error);
    } finally {
      setCargando(false);
    }
  };

  const cancelarInscripcion = (inscripcionId, titulo, eventId, cuposDisponibles) => {
    Alert.alert(
      'Cancelar inscripción',
      `¿Estás seguro que deseas cancelar tu inscripción a "${titulo}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'inscripciones', inscripcionId));
              const eventoRef = doc(db, 'eventos', eventId);
              await updateDoc(eventoRef, {
                cuposDisponibles: cuposDisponibles + 1
              });
              setMisEventos(prev => prev.filter(e => e.inscripcionId !== inscripcionId));
              Alert.alert('Listo', 'Tu inscripción fue cancelada.');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cancelar la inscripción.');
            }
          }
        }
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      setCargando(true);
      cargarMisEventos();
    }, [])
  );

  if (cargando) return <ActivityIndicator size="large" color="#4A90E2" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Eventos</Text>
      {misEventos.length === 0 ? (
        <Text style={styles.vacio}>No estás inscrito en ningún evento.</Text>
      ) : (
        <FlatList
          data={misEventos}
          keyExtractor={(item) => item.inscripcionId}
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <TouchableOpacity onPress={() => navigation.navigate('Detalle', { eventoId: item.eventId })}>
                <Text style={styles.nombreEvento}>{item.titulo}</Text>
                <Text style={styles.infoEvento}>📍 {item.lugar}</Text>
                <Text style={styles.infoEvento}>📅 {item.Hora}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botonCancelar}
                onPress={() => cancelarInscripcion(item.inscripcionId, item.titulo, item.eventId, item.cuposDisponibles)}
              >
                <Text style={styles.botonCancelarTexto}>Cancelar inscripción</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default MisEventosScreen; 